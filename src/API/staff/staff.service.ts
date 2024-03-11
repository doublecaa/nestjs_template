import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from '../../database/entities';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginStaffDto, staffFilterDto } from './dto';
import { compareSync } from 'bcrypt';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
    private jwtService: JwtService,
  ) { }
  private async generateToken(staff: Staff) {
    const data = {
      id: staff.id,
      email: staff.email,
      role: Roles.Staff
    };
    const accessToken = await this.jwtService.signAsync(data, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = await this.jwtService.signAsync(data, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
    return { accessToken, refreshToken };
  }
  async login(params: LoginStaffDto) {
    try {
      // Kiểm tra email có tồn tại
      const staff = await this.staffRepo.findOne({
        where: { email: params.email }
      })
      if (!staff) {
        throw new UnauthorizedException(`${params.email} is not exist`);
      }
      // So khớp mật khẩu trong DB
      const matchPassword = compareSync(params.password, staff.password);
      if (!matchPassword) {
        throw new UnauthorizedException('Account or password is incorrect');
      }
      // Tạo token, update vào DB
      const { refreshToken, accessToken } = await this.generateToken(staff);
      await this.staffRepo.update(staff.id, {
        refreshToken,
        accessToken,
      });
      delete staff.password;
      delete staff.refreshToken;
      delete staff.accessToken;
      return {
        accessToken,
        refreshToken,
        data: staff,
      };
    } catch (e) {
      throw new Error(e.stack.split('\n')[0]);
    }
  }
  async getList(params: staffFilterDto, req: any) {
    try {
      const filter = {};
      const skip = params.skip;
      const take = params.take;
      const order = {};
      let key = 'createdAt';
      let value = 'desc';
      if (params.value && params.key) {
        key = params.key;
        value = params.value;
      }
      order[key] = value;
      delete params.skip;
      delete params.take;
      delete params.value;
      delete params.key;
      for (const key in params) {
        filter[key] = Like(`%${params[key]}%`);
      }
      // Lấy danh sách nhân viên kèm filter trong DB
      const data = await this.staffRepo.find({
        where: filter,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        },
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.staffRepo.count({
        where: filter,
        order: order,
      });
      const result = {
        data: data,
        total: total,
      };
      // Trả kết quả
      return result;
    } catch (e) {
      throw new Error(e.stack.split('\n')[0]);
    }
  }
}
