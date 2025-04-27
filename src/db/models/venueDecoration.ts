import { Schema, model, Document, Types } from 'mongoose';

export interface IVenueDecoration extends Document<Types.ObjectId> {
  venueId: Types.ObjectId;

  name: string;
  description?: string;

  price?: number;

  imagePath?: string;
  renderPath?: string;

  isActive: boolean;
}

const VenueDecorationSchema = new Schema<IVenueDecoration>(
  {
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },

    name: { type: String, required: true },
    description: String,

    price: Number,

    imagePath: String,
    renderPath: String,

    isActive: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

VenueDecorationSchema.virtual('venue', {
  ref: 'Venue',
  localField: 'venueId',
  foreignField: '_id',
  justOne: true
});

// prettier-ignore
export const VenueDecorationModel = model('VenueDecoration', VenueDecorationSchema);

