import { Site, Governorate, Person, Artifact } from '../types';

export const GOVERNORATES: Governorate[] = [
  { id: 'giza', name: { ar: 'الجيزة', en: 'Giza', ru: 'Гиза' }, coordinates: { x: 45, y: 30 }, sitesCount: 15 },
  { id: 'luxor', name: { ar: 'الأقصر', en: 'Luxor', ru: 'Луксор' }, coordinates: { x: 55, y: 65 }, sitesCount: 40 },
  { id: 'aswan', name: { ar: 'أسوان', en: 'Aswan', ru: 'Асуан' }, coordinates: { x: 55, y: 85 }, sitesCount: 25 },
  { id: 'alexandria', name: { ar: 'الإسكندرية', en: 'Alexandria', ru: 'Александрия' }, coordinates: { x: 35, y: 20 }, sitesCount: 10 },
  { id: 'cairo', name: { ar: 'القاهرة', en: 'Cairo', ru: 'Каир' }, coordinates: { x: 48, y: 28 }, sitesCount: 20 },
  { id: 'minya', name: { ar: 'المنيا', en: 'Minya', ru: 'Минья' }, coordinates: { x: 45, y: 45 }, sitesCount: 12 },
  { id: 'sohag', name: { ar: 'سوهاج', en: 'Sohag', ru: 'Сохаг' }, coordinates: { x: 50, y: 58 }, sitesCount: 15 },
  { id: 'qena', name: { ar: 'قنا', en: 'Qena', ru: 'Кена' }, coordinates: { x: 55, y: 62 }, sitesCount: 10 },
  { id: 'sinai_south', name: { ar: 'جنوب سيناء', en: 'South Sinai', ru: 'Южный Синай' }, coordinates: { x: 70, y: 40 }, sitesCount: 8 },
];

export const SITES: Site[] = [
  {
    id: 'pyramids_giza',
    name: { ar: 'أهرامات الجيزة', en: 'Giza Pyramids', ru: 'Пирамиды Гизы' },
    hieroglyphicName: '𓉶𓉶𓉶',
    description: {
      ar: 'مجموعة من الأهرامات الملكية التي بنيت في عهد الأسرة الرابعة في المملكة القديمة.',
      en: 'A complex of royal pyramids built during the Fourth Dynasty of the Old Kingdom.',
      ru: 'Комплекс королевских пирамид, построенных во время Четвертой династии Древнего царства.'
    },
    period: { ar: 'الدولة القديمة', en: 'Old Kingdom', ru: 'Древнее царство' },
    governorateId: 'giza',
    coordinates: { x: 45, y: 30 },
    images: [
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750',
      'https://images.unsplash.com/photo-1568503504139-bfdc7a1ddeee'
    ],
    artifacts: ['khufu_ship'],
    tombs: ['Khufu', 'Khafre', 'Menkaure'],
    discoveryDate: 'Ancient times',
    virtualTourUrl: 'https://mpembed.com/show/?m=9S9p7m8i8y9'
  },
  {
    id: 'karnak',
    name: { ar: 'معبد الكرنك', en: 'Karnak Temple', ru: 'Карнакский храм' },
    description: {
      ar: 'أكبر دار للعبادة تم بناؤها على وجه الأرض، استمر بناؤه لأكثر من 1500 عام.',
      en: 'The largest religious complex ever built, under construction for over 1500 years.',
      ru: 'Крупнейший религиозный комплекс, строившийся более 1500 лет.'
    },
    period: { ar: 'الدولة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    governorateId: 'luxor',
    coordinates: { x: 55, y: 65 },
    images: [
      'https://images.unsplash.com/photo-1542397441-2a6285496150',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a',
      'https://images.unsplash.com/photo-1590510326499-f22dfb0447e4'
    ],
    artifacts: []
  }
];

export const KINGS: Person[] = [
  {
    id: 'sety_i',
    name: { ar: 'سيتي الأول', en: 'Sety I', ru: 'Сети I' },
    hieroglyphicName: '𓇳𓈖𓌶𓂶',
    title: { ar: 'من ماعت رع', en: 'Menmaatre', ru: 'Менмаатра' },
    description: {
      ar: 'فرعون من الأسرة التاسعة عشر، والد رمسيس الثاني.',
      en: 'Pharaoh of the Nineteenth Dynasty, father of Ramesses II.',
      ru: 'Фараон Девятнадцатой династии, отец Рамсеса II.'
    },
    period: { ar: 'الدولة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    achievements: [
      { ar: 'حملات عسكرية في الشام', en: 'Military campaigns in Levant', ru: 'Военные кампании в Леванте' }
    ],
    images: ['https://images.unsplash.com/photo-1599121174707-1718329d7c84'],
    familyTree: {
      spouses: ['tuya'],
      children: ['ramesses_ii']
    }
  },
  {
    id: 'tuya',
    name: { ar: 'تويا', en: 'Tuya', ru: 'Туя' },
    hieroglyphicName: '𓏏𓅱𓇋𓄿',
    title: { ar: 'الزوجة الملكية العظمى', en: 'Great Royal Wife', ru: 'Великая царская жена' },
    description: {
      ar: 'زوجة سيتي الأول ووالدة رمسيس الثاني.',
      en: 'Wife of Sety I and mother of Ramesses II.',
      ru: 'Жена Сети I и мать Рамсеса II.'
    },
    period: { ar: 'الدولة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    achievements: [],
    images: ['https://images.unsplash.com/photo-1542301197-15118d094760'],
    familyTree: {
      spouses: ['sety_i'],
      children: ['ramesses_ii']
    }
  },
  {
    id: 'ramesses_ii',
    name: { ar: 'رمسيس الثاني', en: 'Ramesses II', ru: 'Рамсес II' },
    hieroglyphicName: '𓇳𓄟𓈖𓈘𓍘𓈖𓌟𓅓',
    title: { ar: 'رمسيس الكبير', en: 'Ramesses the Great', ru: 'Рамсес Великий' },
    description: {
      ar: 'ثالث فراعنة الأسرة التاسعة عشر، يعتبره الكثيرون الفرعون الأكثر قوة وشهرة.',
      en: 'The third pharaoh of the Nineteenth Dynasty of Egypt, often regarded as the greatest.',
      ru: 'Третий фараон Девятнадцатой династии Египта, часто считающийся величайшим.'
    },
    period: { ar: 'المملكة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    achievements: [
      { ar: 'معركة قادش', en: 'Battle of Kadesh', ru: 'Битва при Кадеше' },
      { ar: 'بناء معبد أبو سمبل', en: 'Building Abu Simbel', ru: 'Строительство Абу-Симбела' }
    ],
    mummyStatus: { ar: 'محفوظة جيداً', en: 'Well preserved', ru: 'Хорошо сохранилась' },
    mummyLocation: { ar: 'المتحف القومي للحضارة المصرية', en: 'NMEC', ru: 'NMEC' },
    images: ['https://images.unsplash.com/photo-1627440663141-75233bc58b2a'],
    familyTree: {
      father: 'sety_i',
      mother: 'tuya',
      spouses: ['nefertari'],
      children: ['khaemwaset', 'merneptah']
    }
  },
  {
    id: 'nefertari',
    name: { ar: 'نفرتاري', en: 'Nefertari', ru: 'Нефертари' },
    hieroglyphicName: '𓄤𓆑𓂋𓏏𓇋𓂋𓇋',
    title: { ar: 'الزوجة الملكية العظمى', en: 'Great Royal Wife', ru: 'Великая царская жена' },
    description: {
      ar: 'الزوجة الأولى والمفضلة لرمسيس الثاني، تشتهر بجمالها وضريحها الرائع في وادي الملكات.',
      en: 'The first and most beloved wife of Ramesses II, famous for her beauty and tomb.',
      ru: 'Первая и самая любимая жена Рамсеса II, знаменитая своей красотой и гробницей.'
    },
    period: { ar: 'الدولة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    achievements: [
      { ar: 'معاهدة السلام مع الحيثيين', en: 'Hitite Peace Treaty diplomacy', ru: 'Дипломатия мирного договора с хеттами' }
    ],
    images: ['https://images.unsplash.com/photo-1542318858-6923485741c8'],
    familyTree: {
      spouses: ['ramesses_ii'],
      children: ['khaemwaset']
    }
  },
  {
    id: 'khaemwaset',
    name: { ar: 'خعمواست', en: 'Khaemwaset', ru: 'Хаэмуас' },
    hieroglyphicName: '𓈍𓅓𓅱𓄿𓊃𓏏',
    title: { ar: 'الأمير الساكن في منف', en: 'Prince of Memphis', ru: 'Принц Мемфиса' },
    description: {
      ar: 'الابن الرابع لرمسيس الثاني، يُعرف بأول عالم آثار في التاريخ لترميمه المعالم القديمة.',
      en: 'Fourth son of Ramesses II, known as the first archaeologist for restoring ancient monuments.',
      ru: 'Четвертый сын Рамсеса II, известный как первый археолог за реставрацию древних памятников.'
    },
    period: { ar: 'الدولة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    achievements: [
      { ar: 'ترميم الأهرامات', en: 'Restoring the Pyramids', ru: 'Реставрация пирамид' }
    ],
    images: ['https://images.unsplash.com/photo-1599121174092-258079090623'],
    familyTree: {
      father: 'ramesses_ii',
      mother: 'nefertari'
    }
  },
  {
    id: 'merneptah',
    name: { ar: 'مرنبطاح', en: 'Merneptah', ru: 'Мернептах' },
    hieroglyphicName: '𓇳𓈖𓈘𓍘𓈖𓌟𓅓',
    title: { ar: 'ابن رمسيس الثاني', en: 'Son of Ramesses II', ru: 'Сын Рамсеса II' },
    description: {
      ar: 'خلف والده رمسيس الثاني كفرعون لمصر.',
      en: 'Succeeded his father Ramesses II as Pharaoh of Egypt.',
      ru: 'Сменил своего отца Рамсеса II на посту фараона Египта.'
    },
    period: { ar: 'الدولة الحديثة', en: 'New Kingdom', ru: 'Новое царство' },
    achievements: [],
    images: ['https://images.unsplash.com/photo-1627440663141-75233bc58b2a'],
    familyTree: {
      father: 'ramesses_ii'
    }
  }
];
