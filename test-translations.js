const { translations } = require('./utils/translations');

console.log('Keys:', Object.keys(translations));
try {
    console.log('VI Nav Home:', translations.vi.nav_home);
    console.log('EN Nav Home:', translations.en.nav_home);
    console.log('KO Nav Home:', translations.ko.nav_home);
    console.log('ZH Nav Home:', translations.zh.nav_home);
    console.log('Success');
} catch (e) {
    console.error('Error:', e);
    process.exit(1);
}
