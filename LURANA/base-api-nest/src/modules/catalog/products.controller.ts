import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  // 1. API CÔNG KHAI: Lấy danh sách sản phẩm (Ẩn giá nhập)
  @Get()
  async findAll(@Query() query: ListProductsDto) {
    return this.productsService.findAll(query);
  }
  // 2. API CÔNG KHAI: Xem chi tiết sản phẩm (Ẩn giá nhập)
  @Get(':id')
  async findOnePublic(@Param('id') id: string) {
    return this.productsService.findOnePublic(id);
  }
  // 3. API ADMIN: Tạo sản phẩm mới
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  // 4. API ADMIN: Lấy chi tiết đầy đủ (Bao gồm giá nhập để quản lý)
  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findOneAdmin(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  // 5. API ADMIN: Cập nhật sản phẩm
  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }
  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}