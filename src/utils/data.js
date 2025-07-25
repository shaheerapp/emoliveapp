import { IMAGES } from '../assets/images';

export const actionItems = [
  { title: 'Messages', icon: IMAGES.msg, navigation: 'Inbox' },
  { title: 'Agencies', icon: IMAGES.agency, navigation: 'Agency' },
  { title: 'Family', icon: IMAGES.family, navigation: 'JoinAgency' },
  { title: 'Wallet', icon: IMAGES.wallet, navigation: 'Coin' },
  { title: 'Join Agency', icon: IMAGES.handShake, navigation: 'JoinAgency' },
  { title: 'Level', icon: IMAGES.arrow, navigation: 'Level' },
  { title: 'Apply for Agency', icon: IMAGES.agency, link: 'https://emolivestreaming.online/apply-for-agency' },

];
export const otherItems = [
  { title: 'Ranking', icon: IMAGES.ranking, navigation: 'Ranking' },
  { title: 'Terms', icon: IMAGES.terms, navigation: '' },
  { title: 'Baggage', icon: IMAGES.Baggages, navigation: '' },
  { title: 'Settings', icon: IMAGES.wallet, navigation: 'Settings' },
  {
    title: 'Check For Update',
    icon: IMAGES.refresh,
    navigation: 'onCheckGitVersion',
  },
  { title: 'My Store', icon: IMAGES.store, navigation: '' },
];
export const characterItems = [
  { title: 'Agency Owner', icon: IMAGES.agencyOwner },
  // { title: 'BD admin', icon: IMAGES.bdAdmin },
  { title: 'Official', icon: IMAGES.official },
  { title: 'Host', icon: IMAGES.music },
  // {
  //   title: 'Super Admin',
  //   icon: IMAGES.superAdmin
  // },
  // { title: 'Admin', icon: IMAGES.admin },
];
