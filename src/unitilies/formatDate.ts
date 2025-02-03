export default function formatDate(date: Date | string, format: string) {
  const fixedDate = (typeof date === 'string') ? new Date(date) : date;

  const year = fixedDate.getFullYear().toString();
  const month = (fixedDate.getMonth() + 1).toString().padStart(2, '0'); // add 1 because mouth starts with 0
  const day = fixedDate.getDate().toString().padStart(2, '0');
  const hours = fixedDate.getHours().toString().padStart(2, '0');
  const minutes = fixedDate.getMinutes().toString().padStart(2, '0');
  const seconds = fixedDate.getSeconds().toString().padStart(2, '0');
  const milliseconds = fixedDate.getMilliseconds().toString().padStart(3, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('sss', milliseconds);
}
