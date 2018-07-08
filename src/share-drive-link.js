
export default function (data) {
  let url = 'http://localhost:3001/?';
  const parts = [
    'status=',
    `season=${data.Season_Code || ''}`,
    'date=',
    `divi=${data.Division_Code || ''}`,
    `designer=${data.Brand_Code || ''}`,
    `id=${data.Item_No || ''}`,
    `colour=${data.Colour_Code}`,
  ];

  url += parts.join('&');
  return url;
}
