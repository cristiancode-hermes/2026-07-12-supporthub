import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, TicketFilterDto } from './dto/ticket.dto';

@ApiTags('Tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'List tickets (org-scoped, with filters)' })
  @ApiQuery({ name: 'status', required: false, enum: ['new', 'assigned', 'in_progress', 'resolved', 'closed'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high', 'urgent'] })
  findAll(@Query() filter: TicketFilterDto, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.findAll(orgId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.findOne(id, orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a ticket' })
  create(@Body() dto: CreateTicketDto, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    const userId = (req.user as any).id;
    return this.service.create(dto, orgId, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ticket (status, priority, assignment)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTicketDto, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.update(id, dto, orgId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const orgId = (req.user as any).organizationId;
    return this.service.remove(id, orgId);
  }
}
