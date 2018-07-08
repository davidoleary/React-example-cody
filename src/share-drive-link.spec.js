import { expect } from 'chai';
import shareDriveLink from './share-drive-link';

describe('share-drive-link', () => {
  it('returns empty drive address parts for an item with no populated info', async () => {
    const props = {
      Season_Code: '',
      'Shootlist Date': '',
      Division_Code: '',
      Item_No: '',
      Brand_Code: '',
    };

    const url = shareDriveLink(props);
    expect(url).to.equals('http://localhost:3001/?status=&season=&date=&divi=&designer=&id=');
  });

  it('returns the drive address for an item', async () => {
    const props = {
      Season_Code: 'SS17',
      'Shootlist Date': '',
      Division_Code: 'Some division',
      Item_No: '12345',
      Brand_Code: 'GUCCI',
    };

    const url = shareDriveLink(props);
    expect(url).to.equals('http://localhost:3001/?status=&season=SS17&date=&divi=Some division&designer=GUCCI&id=12345');
  });
});
