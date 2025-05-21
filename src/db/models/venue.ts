import { Schema, model, Document, Types } from 'mongoose';

export interface IVenue extends Document<Types.ObjectId> {
  name: string;
  description?: string;

  addressCountry: string;
  addressCity: string;
  addressArea: string;
  addressZip: string;

  price?: number;

  openAtTiming?: string;
  openAtDays?: string;

  imagePath?: string;
  renderPath?: string;

  isActive: boolean;
}

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true },
    description: String,
    addressCountry: { type: String, required: true },
    addressCity: { type: String, required: true },
    addressArea: { type: String, required: true },
    addressZip: { type: String, required: true },

    price: Number,

    openAtTiming: String,
    openAtDays: String,

    imagePath: String,
    renderPath: String,

    isActive: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

VenueSchema.virtual('decorations', {
  ref: 'VenueDecoration',
  localField: '_id',
  foreignField: 'venueId',
});

// prettier-ignore
export const VenueModel = model('Venue', VenueSchema);

