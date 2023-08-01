import { ArchbaseDataSource } from './ArchbaseDataSource';

// Mock data for testing
const sampleRecords = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

describe('ArchbaseDataSource', () => {
  let dataSource;

  beforeEach(() => {
    const options = {
      records: sampleRecords,
      grandTotalRecords: sampleRecords.length,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    };
    dataSource = new ArchbaseDataSource('testDataSource', options);
  });

  it('should initialize correctly', () => {
    expect(dataSource.isActive()).toBe(true);
    expect(dataSource.isEditing()).toBe(false);
    expect(dataSource.isInserting()).toBe(false);
    expect(dataSource.isBrowsing()).toBe(true);
    expect(dataSource.isBOF()).toBe(false);
    expect(dataSource.isEOF()).toBe(false);
    expect(dataSource.isEmpty()).toBe(false);
    expect(dataSource.isFirst()).toBe(true);
    expect(dataSource.isLast()).toBe(true);
    expect(dataSource.getTotalRecords()).toBe(sampleRecords.length);
    expect(dataSource.getGrandTotalRecords()).toBe(sampleRecords.length);
    expect(dataSource.getCurrentPage()).toBe(1);
    expect(dataSource.getTotalPages()).toBe(1);
  });

  it('should open the data source with new options', () => {
    const newRecords = [{ id: 4, name: 'Alice', age: 28 }];
    const newOptions = {
      records: newRecords,
      grandTotalRecords: newRecords.length,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    };

    dataSource.open(newOptions);

    expect(dataSource.browseRecords()).toEqual(newRecords);
    expect(dataSource.getTotalRecords()).toBe(newRecords.length);
    expect(dataSource.getGrandTotalRecords()).toBe(newRecords.length);
    expect(dataSource.isActive()).toBe(true);
    expect(dataSource.isEditing()).toBe(false);
    expect(dataSource.isInserting()).toBe(false);
    expect(dataSource.isBrowsing()).toBe(true);
    expect(dataSource.isBOF()).toBe(false);
    expect(dataSource.isEOF()).toBe(false);
    expect(dataSource.isEmpty()).toBe(false);
    expect(dataSource.isFirst()).toBe(true);
    expect(dataSource.isLast()).toBe(true);
  });

  it('should throw an error when opening an active data source', () => {
    const newOptions = {
      records: [{ id: 4, name: 'Alice', age: 28 }],
      grandTotalRecords: 1,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    };

    expect(() => {
      dataSource.open(newOptions);
    }).toThrowError('operationNotAllowed');
  });

  it('should append a new record', () => {
    const newRecord = { id: 4, name: 'Alice', age: 28 };

    dataSource.append(newRecord);

    expect(dataSource.browseRecords()).toContain(newRecord);
    expect(dataSource.getTotalRecords()).toBe(sampleRecords.length + 1);
    expect(dataSource.isEOF()).toBe(true);
  });

  it('should insert a new record', () => {
    const newRecord = { id: 4, name: 'Alice', age: 28 };

    dataSource.insert(newRecord);

    expect(dataSource.isInserting()).toBe(true);
    expect(dataSource.isBOF()).toBe(false);
    expect(dataSource.isEOF()).toBe(false);
    expect(dataSource.getCurrentRecord()).toEqual(newRecord);
  });

  it('should throw an error when inserting/editing while data source is not active', () => {
    dataSource.close();

    expect(() => {
      dataSource.insert({ id: 4, name: 'Alice', age: 28 });
    }).toThrowError('operationNotAllowed');

    expect(() => {
      dataSource.edit();
    }).toThrowError('operationNotAllowed');
  });

  it('should remove a record', async () => {
    const callback = jest.fn();

    await dataSource.remove(callback);

    expect(dataSource.browseRecords()).not.toContain(sampleRecords[0]);
    expect(dataSource.getTotalRecords()).toBe(sampleRecords.length - 1);
    expect(dataSource.getCurrentRecord()).toEqual(sampleRecords[1]);
    expect(callback).toHaveBeenCalled();
  });

  it('should throw an error when removing a record while data source is not active', () => {
    dataSource.close();

    expect(async () => {
      await dataSource.remove(() => {});
    }).rejects.toThrowError('operationNotAllowed');
  });

  it('should edit the current record', () => {
    dataSource.edit();

    expect(dataSource.isEditing()).toBe(true);
  });

  it('should throw an error when editing without an active record', () => {
    dataSource.close();

    expect(() => {
      dataSource.edit();
    }).toThrowError('noActiveRecord');
  });

  it('should save the changes after editing', async () => {
    const updatedRecord = { id: 1, name: 'John Doe', age: 31 };

    dataSource.edit();
    dataSource.getCurrentRecord().name = updatedRecord.name;
    dataSource.getCurrentRecord().age = updatedRecord.age;

    const callback = jest.fn();
    await dataSource.save(callback);

    expect(dataSource.isEditing()).toBe(false);
    expect(dataSource.getCurrentRecord()).toEqual(updatedRecord);
    expect(callback).toHaveBeenCalled();
  });

  it('should throw an error when saving changes with no active record', () => {
    dataSource.close();

    expect(async () => {
      await dataSource.save(() => {});
    }).rejects.toThrowError('noActiveRecord');
  });

  it('should cancel the changes after editing', () => {
    dataSource.edit();

    dataSource.getCurrentRecord().name = 'John Doe';
    dataSource.getCurrentRecord().age = 31;

    dataSource.cancel();

    expect(dataSource.isEditing()).toBe(false);
    expect(dataSource.getCurrentRecord()).not.toEqual({ id: 1, name: 'John Doe', age: 31 });
  });

  it('should throw an error when canceling changes with no active record', () => {
    dataSource.close();

    expect(() => {
      dataSource.cancel();
    }).toThrowError('noActiveRecord');
  });

  it('should move to the first record', () => {
    dataSource.moveFirst();

    expect(dataSource.getCurrentRecord()).toEqual(sampleRecords[0]);
  });

  it('should move to the last record', () => {
    dataSource.moveLast();

    expect(dataSource.getCurrentRecord()).toEqual(sampleRecords[sampleRecords.length - 1]);
  });

  it('should move to the previous record', () => {
    dataSource.moveLast(); // Move to the last record first

    const previousRecordIndex = sampleRecords.length - 2;
    dataSource.movePrevious();

    expect(dataSource.getCurrentRecord()).toEqual(sampleRecords[previousRecordIndex]);
  });

  it('should move to the next record', () => {
    dataSource.moveFirst(); // Move to the first record first

    dataSource.moveNext();

    expect(dataSource.getCurrentRecord()).toEqual(sampleRecords[1]);
  });

  it('should not move beyond the first record', () => {
    dataSource.moveFirst();

    dataSource.movePrevious(); // Try to move before the first record

    expect(dataSource.isBOF()).toBe(true);
  });

  it('should not move beyond the last record', () => {
    dataSource.moveLast();

    dataSource.moveNext(); // Try to move beyond the last record

    expect(dataSource.isEOF()).toBe(true);
  });

  it('should throw an error when attempting to move while data source is not active', () => {
    dataSource.close();

    expect(() => {
      dataSource.moveFirst();
    }).toThrowError('operationNotAllowed');
  });

  it('should browse records within the current page', () => {
    dataSource.moveFirst();

    const records = dataSource.browseRecords();

    expect(records).toHaveLength(sampleRecords.length);
    expect(records).toEqual(sampleRecords);
  });

  it('should throw an error when browsing records while data source is not active', () => {
    dataSource.close();

    expect(() => {
      dataSource.browseRecords();
    }).toThrowError('operationNotAllowed');
  });

  it('should throw an error when closing an already closed data source', () => {
    dataSource.close();

    expect(() => {
      dataSource.close();
    }).toThrowError('operationNotAllowed');
  });
});

