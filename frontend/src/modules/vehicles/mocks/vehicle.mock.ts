import { getVehicleImageByModel } from '@/common/lib/vehicle-images';

const j5 = getVehicleImageByModel('JAECOO J5 EV');
const j7 = getVehicleImageByModel('JAECOO J7 SHS-P');
const j8 = getVehicleImageByModel('JAECOO J8 ARDIS');
const j8shs = getVehicleImageByModel('JAECOO J8 SHS-P ARDIS');

export const vehicleRowsMock = [
  { plate: 'AB 1205 EV', unit: 'JAECOO J5 EV', km: '3.420 km', color: 'Moonlight Silver', imageSrc: j5.src, imageAlt: j5.alt },
  { plate: 'AB 7718 SP', unit: 'JAECOO J7 SHS-P', km: '8.140 km', color: 'Forest Black', imageSrc: j7.src, imageAlt: j7.alt },
  { plate: 'AB 8808 AR', unit: 'JAECOO J8 ARDIS', km: '6.980 km', color: 'White Pearl', imageSrc: j8.src, imageAlt: j8.alt },
  { plate: 'AB 9908 SA', unit: 'JAECOO J8 SHS-P ARDIS', km: '2.610 km', color: 'Ash Blue', imageSrc: j8shs.src, imageAlt: j8shs.alt },
];
