import { IsString, IsOptional, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { TicketStatus, TicketPriority } from '../ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ example: 'Cannot login to dashboard' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'User reports error when attempting to login...' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' })
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority: TicketPriority;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  customerId: number;
}

export class UpdateTicketDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['new', 'assigned', 'in_progress', 'resolved', 'closed'] })
  @IsOptional()
  @IsIn(['new', 'assigned', 'in_progress', 'resolved', 'closed'])
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: ['low', 'medium', 'high', 'urgent'] })
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: TicketPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  assignedToId?: number | null;
}

export class TicketFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['new', 'assigned', 'in_progress', 'resolved', 'closed'])
  status?: TicketStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: TicketPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  assignedToId?: number;
}
