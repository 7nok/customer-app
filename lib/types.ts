export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeeklySlot = {
  weekday: Weekday;
  start: string;
};

export type Vehicle = {
  id: string;
  year: string;
  make: string;
  model: string;
};

export type Profile = {
  name: string;
  email: string;
  vehicles: Vehicle[];
  signedUpAt: string;
};

export type Appointment = {
  id: string;
  createdAt: string;
  date: string;
  start: string;
  end: string;
  year: string;
  make: string;
  model: string;
  notes: string;
  customerName?: string;
};

export type BookableSlot = {
  id: string;
  date: string;
  weekday: Weekday;
  start: string;
  end: string;
};

export type VehicleType = 'car' | 'truck';
