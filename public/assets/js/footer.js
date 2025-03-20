const copyrightYearP = document.getElementById('footer-copyright-year');
const license = document.getElementById('license');

const currentYear = new Date().getFullYear();
copyrightYearP.textContent = 'AlekOmOm ©' + currentYear;
license.textContent = 'MIT License';
