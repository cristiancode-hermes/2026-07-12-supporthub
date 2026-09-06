import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers (org-scoped)' })
  findAll(@Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.findOne(id, orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  create(@Body() dto: CreateCustomerDto, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.create(dto, orgId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.update(id, dto, orgId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.remove(id, orgId);
  }
}
