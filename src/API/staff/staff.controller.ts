import { Controller, Get, Post, Body, HttpCode, Query, Req } from '@nestjs/common';
import { StaffService } from './staff.service';
import { LoginStaffDto, staffFilterDto } from './dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/guard.decorator';
import { Roles } from 'src/common/enums/roles.enum';

@Controller('staff')
@ApiBearerAuth()
@ApiTags('Staff - StaffAPI')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login staff' })
  login(@Body() params: LoginStaffDto) {
    return this.staffService.login(params);
  }

  @Get()
  @HttpCode(200)
  @Auth(Roles.Staff)
  @ApiOperation({ summary: 'Get list of staffs' })
  getList(@Query() params: staffFilterDto, @Req() req: any) {
    return this.staffService.getList(params, req);
  }
}
