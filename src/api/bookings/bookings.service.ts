import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReturnModelType } from '@typegoose/typegoose';
import { differenceInDays } from 'date-fns';
import { InjectModel } from 'nestjs-typegoose';
import { RequestUser } from 'src/app/contracts/RequestUser.interface';
import { DatabaseRepository } from 'src/app/database/DatabaseRepository';
import { AppMessage } from 'src/app/utils/messages.enum';
import { toMongooseObjectId } from 'src/app/utils/mongoose-helper';
import { Product } from '../products/entities/product.entity';
import { BOOKING_STATUS } from './contracts/booking-types.enum';
import { BookingListQueryDto } from './dto/booking-list-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingReturnDto } from './dto/return-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly db = new DatabaseRepository(Booking);

  constructor(
    @InjectModel(Booking)
    private readonly model: ReturnModelType<typeof Booking>,
    @InjectModel(Product)
    private readonly productModel: ReturnModelType<typeof Product>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new booking
   * @param payload CreateBookingDto
   * @param authenticatedUser - RequestUser
   * @returns
   */
  async create(payload: CreateBookingDto, authenticatedUser: RequestUser) {
    const _product = await this.productModel.findById(payload.product);

    if (!_product) {
      throw new ForbiddenException(AppMessage.PRODUCT_NOT_FOUND_ERROR);
    }

    // check if the product is available
    if (!_product.availability) {
      throw new ForbiddenException(AppMessage.PRODUCT_NOT_AVAILABLE_ERROR);
    }

    const productIsAlreadyBooked = await this.model.findOne({
      product: { $eq: payload.product },
      user: { $eq: authenticatedUser.subscriber },
      status: BOOKING_STATUS.CONSUMING,
    });
    if (productIsAlreadyBooked) {
      throw new ForbiddenException(AppMessage.PRODUCT_ALREADY_BOOKED_ERROR);
    }
    const data = await this.model.create({
      product: payload.product,
      user: authenticatedUser.subscriber,
      borrowed_at: payload.start_date,
      estimated_end_date: payload.estimated_end_date,
    });

    this.eventEmitter.emit('booking.created', data);
    return data;
  }

  /**
   * Get a single booking by id
   * @param id - string
   * @param authenticatedUser - RequestUser
   * @returns
   */
  async myBookingFindOne(id: string, authenticatedUser: RequestUser) {
    return this.db.show({
      find: {
        _id: { $eq: toMongooseObjectId(id) },
        user: { $eq: authenticatedUser.subscriber },
      },
      population: 'product',
    });
  }

  /***
   * Get all bookings for the authenticated user
   */
  async myBookings(
    payload: BookingListQueryDto,
    authenticatedUser: RequestUser,
  ) {
    const __find = {
      user: { $eq: authenticatedUser.subscriber },
    };

    // when status is provided
    if (payload.status) {
      __find['status'] = { $eq: payload.status };
    }
    return this.db.list({
      pagination: {
        limit: payload.limit,
        page: payload.page,
      },
      population: 'product',
      find: {
        ...__find,
      },
    });
  }

  /**
   * Return a product
   * @param payload - BookingReturnDto
   * @param authenticatedUser
   */
  async returnBooking(
    bookingId: string,
    payload: BookingReturnDto,
    authenticatedUser: RequestUser,
  ) {
    const _booking = await this.model.findOne({
      _id: { $eq: bookingId },
      user: { $eq: authenticatedUser.subscriber },
    });
    if (!_booking) {
      throw new ForbiddenException(AppMessage.BOOKING_NOT_FOUND_ERROR);
    }

    const _product = await this.productModel.findById(_booking.product);
    if (!_product) {
      throw new ForbiddenException(AppMessage.PRODUCT_NOT_FOUND_ERROR);
    }

    // props to update
    let product_mileage = _product.mileage || null;
    let product_durability = _product.durability;

    /**
     * calculate the number of days the product was booked for
     */
    const booked_for_days = differenceInDays(new Date(), _booking.borrowed_at);

    /**
     * calculate the number of days the product was booked for
     */
    let rent_price = _product.price * booked_for_days;

    /**
     * Apply the discount if the product was booked for more beyond the minimum days
     */
    if (booked_for_days > _product.minimum_rent_period) {
      rent_price = rent_price - (_product.discount_rate * rent_price) / 100;
    }

    /**
     * Update the mileage of the product
     * - For the meter type estimation, you can assume that 10 miles will be taken every day.
     */
    if (product_mileage && _product.type === 'meter') {
      product_mileage = product_mileage + 10 * booked_for_days;
    }

    /**
     * Update the durability of the product
     *
     * - For the plain type, durability will be decreased 1 point per every day.
     * - For the meter type, durability will be decreased 2 points per every day. (Assume that 10 miles will be taken every day.)
     */
    if (_product.type === 'meter') {
      product_durability = product_durability - 2 * booked_for_days;
    } else {
      product_durability = product_durability - booked_for_days;
    }

    /**
     * Update the product
     * - Update the mileage and durability of the product.
     * - Update the status of the product to available.
     * - Update the status of the booking to returned.
     */
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        _booking.product,
        {
          mileage: product_mileage,
          durability: product_durability,
          availability: true,
        },
        { new: true },
      );

      console.log(updatedProduct);
    } catch (error) {
      throw new ForbiddenException('Error updating product');
    }

    try {
      const bookUpdated = await this.model.findByIdAndUpdate(
        _booking._id,
        {
          status: BOOKING_STATUS.RETURNED,
          returned_at: Date.now(),
          rent_price,
        },
        { new: true },
      );
      console.log(bookUpdated);
    } catch (error) {
      throw new ForbiddenException('Error updating booking');
    }
  }
}
