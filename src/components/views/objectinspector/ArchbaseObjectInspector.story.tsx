import React from 'react';
import { ArchbaseObjectInspector } from './ArchbaseObjectInspector'; // Replace with the actual path to your Inspector component
import { Meta } from '@storybook/react';

const meta: Meta<typeof ArchbaseObjectInspector>  = {
  title: "Views/Object inspector",
  component: ArchbaseObjectInspector,
};

export default meta;

export const Positive =  () => <ArchbaseObjectInspector data={42}>{''}</ArchbaseObjectInspector>;
export const Zero = () => <ArchbaseObjectInspector data={0}></ArchbaseObjectInspector>;
export const Negative = () => <ArchbaseObjectInspector data={-1}></ArchbaseObjectInspector>;
export const Float = () => <ArchbaseObjectInspector data={1.5}></ArchbaseObjectInspector>;
export const Exponential = () => <ArchbaseObjectInspector data={1e100}></ArchbaseObjectInspector>;
export const NaNValue = () => <ArchbaseObjectInspector data={NaN}></ArchbaseObjectInspector>;
export const InfinityValue = () => <ArchbaseObjectInspector data={Infinity} ></ArchbaseObjectInspector>;

export const PositiveBigInt = () => <ArchbaseObjectInspector data={42}></ArchbaseObjectInspector>;
export const ZeroBigInt = () => <ArchbaseObjectInspector data={0}></ArchbaseObjectInspector>;
export const NegativeBigInt = () => <ArchbaseObjectInspector data={-1}></ArchbaseObjectInspector>;

export const EmptyString = () => <ArchbaseObjectInspector data="" />;
export const SimpleString = () => <ArchbaseObjectInspector data="hello" />;

export const TrueBoolean = () => <ArchbaseObjectInspector data={true} />;
export const FalseBoolean = () => <ArchbaseObjectInspector data={false} />;

export const Undefined = () => <ArchbaseObjectInspector data={undefined} />;

export const Null = () => <ArchbaseObjectInspector data={null} />;

export const TestSymbol = () => <ArchbaseObjectInspector data={Symbol.for('test')} />;


export const EmptyArray = () => <ArchbaseObjectInspector data={[]} />;
export const EmptyArrayWithNonEnumerableProperties = () => <ArchbaseObjectInspector showNonenumerable data={[]} />;
export const BasicArray = () => <ArchbaseObjectInspector data={['cold', 'ice']} />;
export const ArrayWithDifferentTypes = () => <ArchbaseObjectInspector data={['a', 1, {}]} />;
export const LongArray = () => <ArchbaseObjectInspector data={new Array(1000).fill(0).map((_x, i) => i + '')} />;
export const ArrayWithBigObjects = () => (
  <ArchbaseObjectInspector
    data={new Array(100).fill(0).map((_x, i) => ({
      key: i,
      name: `John #${i}`,
      dateOfBirth: new Date(i * 10e8),
      address: `${i} Main Street`,
      zip: 90210 + i,
    }))}
  />
);
export const Uint32ArrayValue = () => <ArchbaseObjectInspector data={new Uint32Array(1000)} />;

export const ObjectDate = () => <ArchbaseObjectInspector data={new Date('2005-04-03')} />;
export const ObjectRegExp = () => <ArchbaseObjectInspector data={/^.*$/} />;
export const EmptyObject = () => <ArchbaseObjectInspector showNonenumerable expandLevel={1} data={{}} />;
export const EmptyStringKeyObject = () => <ArchbaseObjectInspector data={{ '': 'hi' }} />;
export const ObjectWithGetterProperty = () => (
  <ArchbaseObjectInspector
    expandLevel={2}
    data={{
      get prop() {
        return 'v';
      },
    }}
  />
);
export const ObjectWithThrowingGetterProperty = () => (
  <ArchbaseObjectInspector
    expandLevel={2}
    data={{
      get prop() {
        throw new Error();
      },
    }}
  />
);
export const SimpleObject = () => <ArchbaseObjectInspector showNonenumerable expandLevel={2} data={{ k: 'v' }} />;
export const SimpleInheritedObject = () => (
  <ArchbaseObjectInspector showNonenumerable expandLevel={2} data={Object.create({ k: 'v' })} />
);
export const ObjectObject = () => <ArchbaseObjectInspector showNonenumerable expandLevel={1} data={Object} />;
export const ObjectPrototype = () => <ArchbaseObjectInspector showNonenumerable expandLevel={1} data={Object.prototype} />;
export const SimpleObjectWithName = () => <ArchbaseObjectInspector showNonenumerable expandLevel={2} name="test" data={{ k: 'v' }} />;
export const EmptyObjectWithNullPrototype = () => <ArchbaseObjectInspector showNonenumerable data={Object.create(null)} />;
export const ObjectWithNullPrototype = () => (
  <ArchbaseObjectInspector showNonenumerable data={Object.assign(Object.create(null), { key: 'value' })} />
);


export const EmptyMap = () => <ArchbaseObjectInspector data={new Map()} />;
export const BooleanKeysMap = () => (
  <ArchbaseObjectInspector
    data={
      new Map([
        [true, 'one'],
        [false, 'two'],
      ])
    }
  />
);
export const RegexKeysMap = () => (
  <ArchbaseObjectInspector
    data={
      new Map([
        [/\S/g, 'one'],
        [/\D/g, 'two'],
      ])
    }
  />
);
export const StringKeysMap = () => (
  <ArchbaseObjectInspector
    data={
      new Map([
        ['one', 1],
        ['two', 2],
      ])
    }
  />
);
export const ObjectKeysMap = () => (
  <ArchbaseObjectInspector
    data={
      new Map([
        [{}, 1],
        [{ key: 2 }, 2],
      ])
    }
  />
);
export const ArrayKeysMap = () => (
  <ArchbaseObjectInspector
    data={
      new Map([
        [[1], 1],
        [[2], 2],
      ])
    }
  />
);
export const MapKeysMap = () => (
  <ArchbaseObjectInspector
    data={
      new Map([
        [new Map(), 1],
        [new Map([]), 2],
      ])
    }
  />
);

export const EmptySet = () => <ArchbaseObjectInspector data={new Set()} />;
export const SimpleSet = () => <ArchbaseObjectInspector data={new Set([1, 2, 3, 4])} />;
export const NestedSet = () => <ArchbaseObjectInspector data={new Set([1, 2, 3, new Set([1, 2])])} />;

export const AnonymousFunction = () => <ArchbaseObjectInspector data={function () {}} />;
export const AnonymousArrowFunction = () => <ArchbaseObjectInspector data={() => {}} />;

function namedFunction() {
  // eslint-disable-next-line
  console.log('Named Function');
}

export const NamedFunction = () => <ArchbaseObjectInspector data={namedFunction} />;
export const NamedFunctionWithNonEnumerableProperties = () => (
  <ArchbaseObjectInspector showNonenumerable data={namedFunction} />
);

// Nested object examples
export const IceSculpture = () => (
  <ArchbaseObjectInspector
    expandLevel={2}
    data={{
      id: 2,
      name: 'An ice sculpture',
      tags: ['cold', 'ice'],
      dimensions: {
        length: 7.0,
        width: 12.0,
        height: 9.5,
      },
      warehouseLocation: {
        latitude: -78.75,
        longitude: 20.4,
      },
    }}
  />
);

export const Github = () => (
  <ArchbaseObjectInspector
    expandLevel={1}
    data={{
      login: 'defunkt',
      id: 2,
      avatar_url: 'https://avatars.githubusercontent.com/u/2?v=3',
      gravatar_id: '',
      url: 'https://api.github.com/users/defunkt',
      // ... (other properties)
    }}
  />
);

export const Glossary = () => (
  <ArchbaseObjectInspector
    expandLevel={7}
    data={{
      glossary: {
        title: 'example glossary',
        GlossDiv: {
          title: 'S',
          GlossList: {
            GlossEntry: {
              ID: 'SGML',
              SortAs: 'SGML',
              GlossTerm: 'Standard Generalized Markup Language',
              Acronym: 'SGML',
              Abbrev: 'ISO 8879:1986',
              GlossDef: {
                para: 'A meta-markup language, used to create markup languages such as DocBook.',
                GlossSeeAlso: ['GML', 'XML'],
              },
              GlossSee: 'markup',
            },
          },
        },
      },
    }}
  />
);

export const ContrivedExample = () => (
  <ArchbaseObjectInspector
    expandLevel={3}
    data={{
      a1: 1,
      a2: 'A2',
      a3: true,
      a4: undefined,
      a5: {
        'a5-1': null,
        'a5-2': ['a5-2-1', 'a5-2-2'],
        'a5-3': {},
      },
      a6: function () {
        // eslint-disable-next-line
        console.log('hello world');
      },
      a7: new Date('2005-04-03'),
    }}
  />
);
