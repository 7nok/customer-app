import type { VehicleType } from '@/lib/types';

export type GuideCategory = {
  id: string;
  name: string;
  summary: string;
  icon: 'water' | 'car-sport' | 'speedometer' | 'git-network' | 'ellipse' | 'funnel' | 'snow' | 'cog' | 'flash' | 'infinite';
};

export type GuideItem = {
  id: string;
  name: string;
  categoryId: string;
  vehicleTypes: VehicleType[];
  interval: string;
  whatItIs: string;
  watchFor: string;
};

export const GUIDE_DISCLAIMER =
  'These are general recommendations for typical cars and light trucks, not a substitute for inspecting your specific vehicle or following its owner’s manual.';

export const CATEGORIES: GuideCategory[] = [
  { id: 'fluids', name: 'Fluids', summary: 'Oil, brake fluid, coolant, and gear oils.', icon: 'water' },
  { id: 'brakes', name: 'Brakes', summary: 'Pads, rotors, lines, and parking brake.', icon: 'car-sport' },
  { id: 'engine', name: 'Engine', summary: 'Spark, leaks, and wear items under the hood.', icon: 'speedometer' },
  { id: 'suspension', name: 'Suspension', summary: 'Shocks, steering parts, and alignment.', icon: 'git-network' },
  { id: 'tires', name: 'Tires & wheels', summary: 'Rotation, tread, pressure, and balance.', icon: 'ellipse' },
  { id: 'filters', name: 'Filters', summary: 'Air, cabin, fuel, and diesel filters.', icon: 'funnel' },
  { id: 'cooling', name: 'Cooling', summary: 'Radiator, hoses, thermostat, and pump.', icon: 'snow' },
  { id: 'drivetrain', name: 'Drivetrain', summary: 'Transmission, axles, and 4x4 parts.', icon: 'cog' },
  { id: 'electrical', name: 'Electrical', summary: 'Battery, charging, lights, and trailer plugs.', icon: 'flash' },
  { id: 'belts', name: 'Belts & hoses', summary: 'Drive belts, tensioners, and related hoses.', icon: 'infinite' },
];

const both: VehicleType[] = ['car', 'truck'];

export const ITEMS: GuideItem[] = [
  {
    id: 'engine-oil',
    name: 'Engine oil & filter',
    categoryId: 'fluids',
    vehicleTypes: both,
    interval: 'Every 5,000–7,500 miles or about 6 months',
    whatItIs: 'Fresh oil lubricates and cools the engine. The filter traps debris so that oil stays clean.',
    watchFor: 'Oil life light, ticking on cold start, dark sludge on the dipstick, or a leak under the engine.',
  },
  {
    id: 'brake-fluid',
    name: 'Brake fluid',
    categoryId: 'fluids',
    vehicleTypes: both,
    interval: 'Every 30,000 miles or 2–3 years',
    whatItIs: 'Brake fluid transfers pedal pressure to the calipers. It absorbs moisture over time and can boil or corrode parts.',
    watchFor: 'A spongy pedal, a longer stop, or fluid that looks dark instead of clear-to-amber.',
  },
  {
    id: 'coolant',
    name: 'Coolant / antifreeze',
    categoryId: 'fluids',
    vehicleTypes: both,
    interval: 'Every 30,000–60,000 miles or 3–5 years',
    whatItIs: 'Coolant keeps the engine from overheating and from freezing. Old coolant can turn acidic and attack the radiator.',
    watchFor: 'Temperature climbing, sweet smell, puddles, or a low reservoir after a short trip.',
  },
  {
    id: 'trans-fluid',
    name: 'Transmission fluid',
    categoryId: 'fluids',
    vehicleTypes: both,
    interval: 'Every 60,000–100,000 miles (check the owner’s manual)',
    whatItIs: 'This fluid cools and lubricates the transmission. Some units are “lifetime” on paper; many still benefit from a service.',
    watchFor: 'Harsh or delayed shifts, slipping, a burnt smell, or a leak at the pan or cooler lines.',
  },
  {
    id: 'ps-fluid',
    name: 'Power steering fluid',
    categoryId: 'fluids',
    vehicleTypes: both,
    interval: 'Inspect every 15,000 miles; replace if dirty or leaking',
    whatItIs: 'On hydraulic-steer vehicles, this fluid helps you turn the wheel. Many newer vehicles are electric and have no reservoir.',
    watchFor: 'Whine when turning, a heavy wheel, or wetness at the pump or rack.',
  },
  {
    id: 'diff-fluid',
    name: 'Differential gear oil',
    categoryId: 'fluids',
    vehicleTypes: ['truck', 'car'],
    interval: 'Every 30,000–60,000 miles',
    whatItIs: 'Gear oil protects the ring-and-pinion in the axle. Trucks and rear-drive vehicles work this hard on the highway.',
    watchFor: 'Whine that changes with speed, leaks at the pinion seal, or metal on the drain plug.',
  },
  {
    id: 'transfer-case',
    name: 'Transfer case fluid',
    categoryId: 'fluids',
    vehicleTypes: ['truck'],
    interval: 'Every 30,000–60,000 miles',
    whatItIs: 'On 4x4 trucks, the transfer case splits power between front and rear. The fluid wears with heat and towing.',
    watchFor: 'Grinding into 4WD, a leak at the case, or a growl that follows engine speed in 4-high.',
  },
  {
    id: 'washer-fluid',
    name: 'Windshield washer fluid',
    categoryId: 'fluids',
    vehicleTypes: both,
    interval: 'Check monthly',
    whatItIs: 'Keeps the glass clear. In Texas heat the reservoir can run down faster than you expect.',
    watchFor: 'Streaky glass, a dry pump sound, or a cracked bottle.',
  },
  {
    id: 'brake-pads',
    name: 'Brake pads',
    categoryId: 'brakes',
    vehicleTypes: both,
    interval: 'Inspect every 10,000–15,000 miles; replace when worn',
    whatItIs: 'Pads are the wearable friction material that stops the vehicle. Life varies with load, hills, and towing.',
    watchFor: 'Squeal, grind, a pull to one side, or a dash wear warning.',
  },
  {
    id: 'brake-rotors',
    name: 'Brake rotors / drums',
    categoryId: 'brakes',
    vehicleTypes: both,
    interval: 'Inspect with the pads',
    whatItIs: 'Rotors (or drums) are the metal surface the pads press against. They can warp, rust, or wear thin.',
    watchFor: 'Steering shake when braking, grooves you can feel, or deep rust ridges.',
  },
  {
    id: 'brake-lines',
    name: 'Brake hoses & lines',
    categoryId: 'brakes',
    vehicleTypes: both,
    interval: 'Inspect at least once a year',
    whatItIs: 'Rubber hoses and steel lines carry fluid to each wheel. A swollen hose or rusty line is a safety issue.',
    watchFor: 'Cracked rubber, wet fittings, or a pedal that sinks while sitting at a light.',
  },
  {
    id: 'parking-brake',
    name: 'Parking brake',
    categoryId: 'brakes',
    vehicleTypes: both,
    interval: 'Inspect annually; use it now and then so it does not seize',
    whatItIs: 'The parking brake holds the vehicle when parked, especially on a grade. Cables can rust or stretch.',
    watchFor: 'A lever or pedal with no tension, or a truck that rolls on a mild slope.',
  },
  {
    id: 'spark-plugs',
    name: 'Spark plugs',
    categoryId: 'engine',
    vehicleTypes: both,
    interval: 'Every 30,000–100,000 miles, depending on plug type',
    whatItIs: 'Plugs ignite the mixture in a gas engine. Copper plugs need earlier service than iridium or platinum.',
    watchFor: 'Misfire, rough idle, harder starts, or a sudden drop in fuel economy.',
  },
  {
    id: 'ignition',
    name: 'Ignition coils / wires',
    categoryId: 'engine',
    vehicleTypes: both,
    interval: 'Inspect if the engine misfires; often replaced with plugs',
    whatItIs: 'Coils and wires deliver spark. Heat and oil leaks can break them down.',
    watchFor: 'A flashing check-engine light, stumble under load, or a dead miss on one cylinder.',
  },
  {
    id: 'pcv',
    name: 'PCV valve',
    categoryId: 'engine',
    vehicleTypes: both,
    interval: 'Every 30,000–50,000 miles',
    whatItIs: 'The PCV system vents crankcase gases back into the engine. A stuck valve can sludge the oil or leak vacuum.',
    watchFor: 'Whistle, oil in the intake, or a high idle.',
  },
  {
    id: 'timing-belt',
    name: 'Timing belt (if equipped)',
    categoryId: 'engine',
    vehicleTypes: ['car'],
    interval: 'Every 60,000–100,000 miles — follow the specific engine',
    whatItIs: 'Some engines use a belt to keep valves and pistons in time. If it snaps on an interference engine, the repair is large.',
    watchFor: 'Age and mileage matter more than noise. Confirm whether your engine has a belt or a chain.',
  },
  {
    id: 'oil-leaks',
    name: 'Valve cover & common oil leaks',
    categoryId: 'engine',
    vehicleTypes: both,
    interval: 'Inspect at every oil change',
    whatItIs: 'Gaskets dry out and seep. Catching a leak early is cheaper than replacing a soaked belt or coil.',
    watchFor: 'Burning-oil smell, wetness on the valve cover, or spots on the driveway.',
  },
  {
    id: 'shocks',
    name: 'Shocks / struts',
    categoryId: 'suspension',
    vehicleTypes: both,
    interval: 'Often 50,000–80,000 miles; inspect sooner if you haul or run rough roads',
    whatItIs: 'These control bounce after a bump. Worn units make the vehicle wallow and wear tires unevenly.',
    watchFor: 'Nose dive, a bouncy ride, or wetness on a shock body.',
  },
  {
    id: 'ball-joints',
    name: 'Ball joints',
    categoryId: 'suspension',
    vehicleTypes: both,
    interval: 'Inspect every 15,000 miles',
    whatItIs: 'Ball joints let the front end steer and move. A worn joint can get dangerous if it separates.',
    watchFor: 'Clunk over bumps, wandering steering, or uneven inner-edge tire wear.',
  },
  {
    id: 'tie-rods',
    name: 'Tie rods & steering linkage',
    categoryId: 'suspension',
    vehicleTypes: both,
    interval: 'Inspect every 15,000 miles',
    whatItIs: 'These connect the steering gear to the wheels. Play here shows up as a loose wheel and crooked tire wear.',
    watchFor: 'Shimmy, a clunk when turning, or a steering wheel that is off-center.',
  },
  {
    id: 'alignment',
    name: 'Wheel alignment',
    categoryId: 'suspension',
    vehicleTypes: both,
    interval: 'Once a year, after a hard hit, or when you replace steering parts',
    whatItIs: 'Alignment sets how the tires meet the road. Texas farm roads and potholes knock it out.',
    watchFor: 'A pull, a crooked wheel, or a tire wearing on one edge.',
  },
  {
    id: 'leaf-springs',
    name: 'Leaf springs & shackles',
    categoryId: 'suspension',
    vehicleTypes: ['truck'],
    interval: 'Inspect annually, especially if you tow or haul',
    whatItIs: 'Many trucks use leaf springs in the rear. Broken leaves or worn bushings change ride height and tire wear.',
    watchFor: 'A sagging rear, a squeak, or a truck that sits lower on one side.',
  },
  {
    id: 'bushings',
    name: 'Control-arm bushings',
    categoryId: 'suspension',
    vehicleTypes: both,
    interval: 'Inspect every 15,000 miles',
    whatItIs: 'Rubber bushings quiet the suspension. When they crack, the vehicle feels loose and alignment will not hold.',
    watchFor: 'Clunks on takeoff, cracked rubber, or a shift in the steering wheel when you brake.',
  },
  {
    id: 'tire-rotate',
    name: 'Tire rotation',
    categoryId: 'tires',
    vehicleTypes: both,
    interval: 'Every 5,000–8,000 miles',
    whatItIs: 'Moving tires front-to-back evens out wear. A-drive truck and a front-drive car wear in different patterns.',
    watchFor: 'One tire going bald early, or cupping that you can feel with a hand.',
  },
  {
    id: 'tire-tread',
    name: 'Tread depth & wear',
    categoryId: 'tires',
    vehicleTypes: both,
    interval: 'A monthly glance; measure at oil changes',
    whatItIs: 'Texas rain on worn tires is a bad mix. Replace around 4/32" for wet roads; 2/32" is the legal wear-out.',
    watchFor: 'Bald patches, sidewall cracks, nails, or a tire that will not stay aired up.',
  },
  {
    id: 'tire-balance',
    name: 'Wheel balance',
    categoryId: 'tires',
    vehicleTypes: both,
    interval: 'When you feel a shake, or with new tires',
    whatItIs: 'Balance keeps a heavy spot on the tire from hopping. It is a common cause of a steering shake at speed.',
    watchFor: 'Vibration that shows up around highway speed and eases when you slow down.',
  },
  {
    id: 'tire-pressure',
    name: 'Tire pressure (including the spare)',
    categoryId: 'tires',
    vehicleTypes: both,
    interval: 'Monthly, and before a long trip',
    whatItIs: 'The door sticker — not the sidewall — is the right pressure. Heat and cold both move the number.',
    watchFor: 'A TPMS light, a tire that looks low, or a spare that has gone flat in the bed or trunk.',
  },
  {
    id: 'engine-air',
    name: 'Engine air filter',
    categoryId: 'filters',
    vehicleTypes: both,
    interval: 'Every 15,000–30,000 miles; sooner on dusty roads',
    whatItIs: 'The air filter keeps grit out of the engine. Hill County dust will load a filter faster than city miles.',
    watchFor: 'A dirty element you cannot see light through, or a drop in power.',
  },
  {
    id: 'cabin-air',
    name: 'Cabin air filter',
    categoryId: 'filters',
    vehicleTypes: both,
    interval: 'Every 15,000–25,000 miles',
    whatItIs: 'This filter cleans the air from the vents. A clogged one fogs the glass and smells musty.',
    watchFor: 'Weak airflow, an A/C that smells stale, or extra noise from the blower.',
  },
  {
    id: 'fuel-filter',
    name: 'Fuel filter',
    categoryId: 'filters',
    vehicleTypes: both,
    interval: 'Every 30,000–40,000 miles if the vehicle has a serviceable filter',
    whatItIs: 'Some vehicles have a replaceable filter; others are inside the tank. A restricted filter starves the engine.',
    watchFor: 'Hesitation under load or a hard start after the vehicle sits.',
  },
  {
    id: 'diesel-fuel-filter',
    name: 'Diesel fuel filter',
    categoryId: 'filters',
    vehicleTypes: ['truck'],
    interval: 'Every 10,000–20,000 miles on many diesels',
    whatItIs: 'Diesel systems are picky about water and dirt. The filter (and water separator) is routine on work trucks.',
    watchFor: 'A water-in-fuel light, loss of power, or a truck that will not restart when hot.',
  },
  {
    id: 'radiator',
    name: 'Radiator & cap',
    categoryId: 'cooling',
    vehicleTypes: both,
    interval: 'Inspect annually; service with a coolant flush',
    whatItIs: 'The radiator dumps heat. The cap holds system pressure. Bugs, rust, and a weak cap all cause heat-soak.',
    watchFor: 'Overheating in traffic, dried coolant trails, or a cap that will not hold a seal.',
  },
  {
    id: 'coolant-hoses',
    name: 'Radiator & heater hoses',
    categoryId: 'cooling',
    vehicleTypes: both,
    interval: 'Inspect annually',
    whatItIs: 'Hoses get soft, swell, or crack from heat. A burst hose on a Texas summer afternoon strands you.',
    watchFor: 'Soft spots, white crust at a clamp, or a hose that feels mushy when the engine is cool.',
  },
  {
    id: 'thermostat',
    name: 'Thermostat',
    categoryId: 'cooling',
    vehicleTypes: both,
    interval: 'Replace if the temperature is wrong, or with a coolant job',
    whatItIs: 'The thermostat opens when the engine is warm. Stuck closed overheats; stuck open never reaches temp.',
    watchFor: 'A gauge that stays low, or one that climbs fast after a short drive.',
  },
  {
    id: 'water-pump',
    name: 'Water pump',
    categoryId: 'cooling',
    vehicleTypes: both,
    interval: 'Replace when it leaks or weeps; often with a timing-belt job',
    whatItIs: 'The pump circulates coolant. A failed bearing or gasket dumps coolant quickly.',
    watchFor: 'Chirp from the front of the engine, pink or green crust at the pump, or overheating.',
  },
  {
    id: 'trans-service',
    name: 'Transmission service',
    categoryId: 'drivetrain',
    vehicleTypes: both,
    interval: 'Every 60,000–100,000 miles unless the maker says otherwise',
    whatItIs: 'A fluid and filter service (when the pan is serviceable) is cheaper than a rebuild. Towing shortens the interval.',
    watchFor: 'Flare between gears, delayed engagement into drive or reverse, or debris in the pan.',
  },
  {
    id: 'cv-axles',
    name: 'CV axles & boots',
    categoryId: 'drivetrain',
    vehicleTypes: ['car', 'truck'],
    interval: 'Inspect at tire rotations',
    whatItIs: 'CV axles send power to the driven wheels. A torn boot throws grease and then the joint clicks.',
    watchFor: 'Clicking on a tight turn, or a ripped boot slinging grease in the wheel well.',
  },
  {
    id: 'u-joints',
    name: 'U-joints & driveshaft',
    categoryId: 'drivetrain',
    vehicleTypes: ['truck'],
    interval: 'Inspect annually',
    whatItIs: 'Most trucks use a driveshaft with U-joints. Dry joints clunk and can come apart if ignored.',
    watchFor: 'A clunk into gear, vibration that rises with speed, or rust-colored dust at a joint.',
  },
  {
    id: 'four-by-four',
    name: '4WD / 4x4 engagement',
    categoryId: 'drivetrain',
    vehicleTypes: ['truck'],
    interval: 'Exercise monthly; inspect annually',
    whatItIs: 'Unused 4WD can stick. A short, straight engagement on a loose surface keeps hubs and actuators moving.',
    watchFor: 'A 4WD light that will not come on, grinding, or a binding feel on dry pavement.',
  },
  {
    id: 'battery',
    name: 'Battery & terminals',
    categoryId: 'electrical',
    vehicleTypes: both,
    interval: 'Test once a year; many batteries last 3–5 years',
    whatItIs: 'Heat is harder on batteries than cold. Clean, tight terminals matter as much as the battery age.',
    watchFor: 'Slow crank, clicking, white crust on the posts, or a battery light after start.',
  },
  {
    id: 'alternator',
    name: 'Alternator / charging system',
    categoryId: 'electrical',
    vehicleTypes: both,
    interval: 'Test with the battery when the charge is in doubt',
    whatItIs: 'The alternator keeps the battery charged while you drive. A weak unit leaves you stranded after a few starts.',
    watchFor: 'Dim lights at idle, a battery warning lamp, or a growl from the front of the engine.',
  },
  {
    id: 'lights',
    name: 'Lights & bulbs',
    categoryId: 'electrical',
    vehicleTypes: both,
    interval: 'Walk-around once a month',
    whatItIs: 'Headlights, brake lamps, and markers are safety and courtesy. Moisture in a housing will kill a bulb early.',
    watchFor: 'A dark lamp, a rapid-blink turn signal, or fog inside a lens.',
  },
  {
    id: 'starter',
    name: 'Starter',
    categoryId: 'electrical',
    vehicleTypes: both,
    interval: 'Inspect if cranking gets slow or noisy',
    whatItIs: 'The starter turns the engine. Heat-soak after a drive is a common time for a weak starter to fail.',
    watchFor: 'A single click, a grind, or a no-crank that works after a cool-down.',
  },
  {
    id: 'trailer-wiring',
    name: 'Trailer plug & brake controller',
    categoryId: 'electrical',
    vehicleTypes: ['truck'],
    interval: 'Inspect before towing season',
    whatItIs: 'Corrosion in a 7-way plug is common. A brake controller should be tested before you hook a trailer.',
    watchFor: 'Dead trailer lights, a fuse that pops, or trailer brakes that do not grab.',
  },
  {
    id: 'serpentine',
    name: 'Serpentine / drive belt',
    categoryId: 'belts',
    vehicleTypes: both,
    interval: 'Every 60,000–100,000 miles, or as soon as it cracks',
    whatItIs: 'This belt runs the alternator, A/C, and often the water pump. A snapped belt can overheat the engine quickly.',
    watchFor: 'Squeal on start, cracks on the ribbed side, or a belt that looks glazed.',
  },
  {
    id: 'tensioner',
    name: 'Belt tensioner & pulleys',
    categoryId: 'belts',
    vehicleTypes: both,
    interval: 'Inspect with the belt',
    whatItIs: 'The tensioner keeps the belt tight. A weak spring or a noisy pulley will chew a new belt.',
    watchFor: 'Flutter in the belt, a chirp that follows engine speed, or a pulley that feels rough when spun (engine off).',
  },
  {
    id: 'accessory-hoses',
    name: 'Vacuum & small accessory hoses',
    categoryId: 'belts',
    vehicleTypes: both,
    interval: 'Inspect at major services',
    whatItIs: 'Small hoses dry, split, and cause odd idle or A/C issues. They are easy to miss on a quick glance.',
    watchFor: 'Hiss, a rough idle, or a hose that is brittle to the touch.',
  },
];

export function categoriesFor(vehicleType: VehicleType): GuideCategory[] {
  const used = new Set(
    ITEMS.filter((item) => item.vehicleTypes.includes(vehicleType)).map((item) => item.categoryId),
  );
  return CATEGORIES.filter((category) => used.has(category.id));
}

export function itemsFor(vehicleType: VehicleType, categoryId: string): GuideItem[] {
  return ITEMS.filter(
    (item) => item.categoryId === categoryId && item.vehicleTypes.includes(vehicleType),
  );
}

export function itemById(itemId: string): GuideItem | undefined {
  return ITEMS.find((item) => item.id === itemId);
}

export function categoryById(categoryId: string): GuideCategory | undefined {
  return CATEGORIES.find((category) => category.id === categoryId);
}

export function isVehicleType(value: string): value is VehicleType {
  return value === 'car' || value === 'truck';
}
