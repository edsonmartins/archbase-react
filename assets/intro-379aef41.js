import{j as e,a as n,F as d}from"./jsx-runtime-c9381026.js";import{M as t}from"./index-843ba225.js";import{u as i}from"./index-4811e648.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-27256515.js";import"../sb-preview/runtime.js";import"./index-a4816881.js";import"./mapValues-6494ad58.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./index-a38d0dca.js";import"./index-1bc24522.js";import"./extends-4c19d496.js";import"./setPrototypeOf-375db7f1.js";import"./inheritsLoose-789acc4d.js";import"./isNativeReflectConstruct-4e5fac16.js";import"./index-356e4a49.js";import"./index-264fcb29.js";function o(a){const r=Object.assign({h1:"h1",h2:"h2",p:"p",pre:"pre",code:"code",h3:"h3",blockquote:"blockquote",strong:"strong",ul:"ul",li:"li",em:"em",a:"a",ol:"ol"},i(),a.components);return n(d,{children:[e(t,{title:"Validação/Introdução"}),`
`,e(r.h1,{id:"archbasevalidator",children:"ArchbaseValidator"}),`
`,e(r.h2,{id:"como-usar",children:"Como usar"}),`
`,e(r.p,{children:"Crie sua classe e coloque alguns decoradores de validação nas propriedades que deseja validar:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'archbase-react';

export class Post {
  @Length(10, 20)
  title: string;

  @Contains('Olá')
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsEmail()
  email: string;

  @IsFQDN()
  site: string;

  @IsDate()
  createDate: Date;
}

let post = new Post();
post.title = 'Olá'; //não deveria passar
post.text = 'este é um ótimo post sobre o mundo infernal'; //não deveria passar
post.rating = 11; //não deveria passar
post.email = 'google.com'; //não deveria passar
post.site = 'googlecom'; //não deveria passar

validate(post).then(errors => {
  // erros é uma matriz de erros de validação
  if (errors.length > 0) {
    console.log('falha na validação. erros: ', errors);
  } else {
    console.log('validação bem sucedida');
  }
});

validateOrReject(post).catch(errors => {
  console.log('Promessa rejeitada (falha na validação). Erros: ', errors);
});
// or
async function validateOrRejectExample(input) {
  try {
    await validateOrReject(input);
  } catch (errors) {
    console.log('Caught promise rejection (falha na validação). Erros: ', errors);
  }
}
`})}),`
`,e(r.h3,{id:"passando-opções-para-o-validador",children:"Passando opções para o validador"}),`
`,n(r.p,{children:["A função ",e(r.code,{children:"validate"})," espera opcionalmente um ",e(r.code,{children:"ValidatorOptions"})," objeto como segundo parâmetro:"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-ts",children:`export interface ValidatorOptions {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  groups?: string[];
  dismissDefaultMessages?: boolean;
  validationError?: {
    target?: boolean;
    value?: boolean;
  };

  forbidUnknownValues?: boolean;
  stopAtFirstError?: boolean;
}
`})}),`
`,n(r.blockquote,{children:[`
`,n(r.p,{children:[e(r.strong,{children:"IMPORTANTE"}),`
O `,e(r.code,{children:"forbidUnknownValues"})," o valor é definido como ",e(r.code,{children:"true"})," por padrão e ",e(r.strong,{children:"é altamente recomendável manter o padrão"}),`.
Definir como `,e(r.code,{children:"false"})," fará com que objetos desconhecidos passem na validação!"]}),`
`]}),`
`,e(r.h2,{id:"erros-de-validação",children:"Erros de validação"}),`
`,n(r.p,{children:["O método ",e(r.code,{children:"validate"})," retorna um array de objetos ",e(r.code,{children:"ValidationError"}),". Cada ",e(r.code,{children:"ValidationError"})," é:"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`{
    target: Object; // Objeto que foi validado.
    property: string; // Propriedade do objeto que não passou na validação.
    value: any; // Valor que não passou na validação.
    constraints?: { // Restrições que falharam na validação com mensagens de erro.
        [type: string]: string;
    };
    children?: ValidationError[]; // Contém todos os erros de validação aninhados da propriedade
}
`})}),`
`,n(r.p,{children:["No nosso caso, quando validamos um objeto Post, temos um array de objetos ",e(r.code,{children:"ValidationError"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`[{
    target: /* post object */,
    property: "title",
    value: "Olá",
    constraints: {
        length: "$property deve ser maior ou igual a 10 caracteres"
    }
}, {
    target: /* post object */,
    property: "text",
    value: "este é um ótimo post sobre o mundo infernal",
    constraints: {
        contains: "o texto deve conter uma string de olá"
    }
},
// e outros erros
]
`})}),`
`,n(r.p,{children:["Se você não deseja que um ",e(r.code,{children:"alvo"})," seja exposto em erros de validação, existe uma opção especial ao usar o validador:"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`validator.validate(post, { validationError: { target: false } });
`})}),`
`,e(r.p,{children:`Isso é especialmente útil quando você envia erros de volta por http e provavelmente não deseja expor
todo o objeto alvo.`}),`
`,e(r.h2,{id:"mensagens-de-validação",children:"Mensagens de validação"}),`
`,n(r.p,{children:["Você pode especificar a mensagem de validação nas opções do decorador e essa mensagem será retornada em ",e(r.code,{children:"ValidationError"}),`
retornado pelo método `,e(r.code,{children:"validate"})," (caso a validação deste campo falhe)."]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { MinLength, MaxLength } from 'archbase-react';

export class Post {
  @MinLength(10, {
    message: 'O título é muito curto',
  })
  @MaxLength(50, {
    message: 'O título é muito longo',
  })
  title: string;
}
`})}),`
`,e(r.p,{children:"Existem alguns tokens especiais que você pode usar em suas mensagens:"}),`
`,n(r.ul,{children:[`
`,n(r.li,{children:[e(r.code,{children:"$value"})," - o valor que está sendo validado"]}),`
`,n(r.li,{children:[e(r.code,{children:"$property"})," - nome da propriedade do objeto que está sendo validada"]}),`
`,n(r.li,{children:[e(r.code,{children:"$target"})," - nome da classe do objeto que está sendo validado"]}),`
`,n(r.li,{children:[e(r.code,{children:"$constraint1"}),", ",e(r.code,{children:"$constraint2"}),", ... ",e(r.code,{children:"$constraintN"})," - restrições definidas por tipo de validação específico"]}),`
`]}),`
`,e(r.p,{children:"Exemplo de uso:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { MinLength, MaxLength } from 'archbase-react';

export class Post {
  @MinLength(10, {
    //aqui, $constraint1 será substituído por "10" e $value pelo valor real fornecido
    message: 'O título é muito curto. O comprimento mínimo é de $constraint1 caracteres, mas o real é de $value',
  })
  @MaxLength(50, {
    // aqui, $constraint1 será substituído por "50" e $value pelo valor real fornecido
    message: 'O título é muito longo. O comprimento máximo é de $constraint1 caracteres, mas o real é $value',
  })
  title: string;
}
`})}),`
`,e(r.p,{children:"Além disso, você pode fornecer uma função que retorne uma mensagem. Isso permite que você crie mensagens mais granulares:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { MinLength, MaxLength, ValidationArguments } from 'archbase-react';

export class Post {
  @MinLength(10, {
    message: (args: ValidationArguments) => {
      if (args.value.length === 1) {
        return 'Muito curto, o comprimento mínimo é de 1 caractere';
      } else {
        return 'Muito curto, o comprimento mínimo é ' + args.constraints[0] + ' caracteres';
      }
    },
  })
  title: string;
}
`})}),`
`,n(r.p,{children:["A função de mensagem aceita ",e(r.code,{children:"ValidationArguments"})," que contém as seguintes informações:"]}),`
`,n(r.ul,{children:[`
`,n(r.li,{children:[e(r.code,{children:"value"})," - o valor que está sendo validado"]}),`
`,n(r.li,{children:[e(r.code,{children:"constraints"})," - matriz de restrições definidas por tipo de validação específico"]}),`
`,n(r.li,{children:[e(r.code,{children:"targetName"})," - nome da classe do objeto que está sendo validado"]}),`
`,n(r.li,{children:[e(r.code,{children:"object"})," - objeto que está sendo validado"]}),`
`,n(r.li,{children:[e(r.code,{children:"property"})," - nome da propriedade do objeto que está sendo validada"]}),`
`]}),`
`,e(r.h2,{id:"validando-arrays",children:"Validando arrays"}),`
`,n(r.p,{children:[`Se o seu campo for um array e você quiser realizar a validação de cada item do array você deve especificar um
opção especial de decorador `,e(r.code,{children:"each: true"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { MinLength, MaxLength } from 'archbase-react';

export class Post {
  @MaxLength(20, {
    each: true,
  })
  tags: string[];
}
`})}),`
`,n(r.p,{children:["Isso validará cada item no array ",e(r.code,{children:"post.tags"}),"."]}),`
`,e(r.h2,{id:"validando-sets",children:"Validando sets"}),`
`,n(r.p,{children:[`Se o seu campo for um conjunto e você quiser realizar a validação de cada item do conjunto você deve especificar um
opção especial de decorador `,e(r.code,{children:"each: true"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { MinLength, MaxLength } from 'archbase-react';

export class Post {
  @MaxLength(20, {
    each: true,
  })
  tags: Set<string>;
}
`})}),`
`,n(r.p,{children:["Isso validará cada item do conjunto ",e(r.code,{children:"post.tags"}),"."]}),`
`,e(r.h2,{id:"validando-maps",children:"Validando maps"}),`
`,n(r.p,{children:[`Se o seu campo for um mapa e você quiser realizar a validação de cada item do mapa você deve especificar um
opção especial de decorador `,e(r.code,{children:"each: true"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { MinLength, MaxLength } from 'archbase-react';

export class Post {
  @MaxLength(20, {
    each: true,
  })
  tags: Map<string, string>;
}
`})}),`
`,n(r.p,{children:["Isso validará cada item no mapa ",e(r.code,{children:"post.tags"}),"."]}),`
`,e(r.h2,{id:"validando-objetos-aninhados",children:"Validando objetos aninhados"}),`
`,n(r.p,{children:[`Se o seu objeto contém objetos aninhados e você deseja que o validador execute sua validação também, então você precisa
use o decorador `,e(r.code,{children:"@ValidateNested()"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidateNested } from 'archbase-react';

export class Post {
  @ValidateNested()
  user: User;
}
`})}),`
`,n(r.p,{children:["Observe que o objeto aninhado ",e(r.em,{children:"deve"})," ser uma instância de uma classe, caso contrário ",e(r.code,{children:"@ValidateNested"})," não saberá qual classe é alvo de validação. Verifique também ",e(r.a,{href:"#validating-plain-objects",children:"Validando objetos simples"}),"."]}),`
`,e(r.p,{children:"Também funciona com array multidimensional, como:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidateNested } from 'archbase-react';

export class Plan2D {
  @ValidateNested()
  matrix: Point[][];
}
`})}),`
`,e(r.h2,{id:"validando-promises",children:"Validando promises"}),`
`,n(r.p,{children:["Se o seu objeto contém uma propriedade com valor retornado por ",e(r.code,{children:"Promise"})," que deve ser validado, então você precisa usar o decorador ",e(r.code,{children:"@ValidatePromise()"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidatePromise, Min } from 'archbase-react';

export class Post {
  @Min(0)
  @ValidatePromise()
  userId: Promise<number>;
}
`})}),`
`,n(r.p,{children:["Também funciona muito bem com o decorador ",e(r.code,{children:"@ValidateNested"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidateNested, ValidatePromise } from 'archbase-react';

export class Post {
  @ValidateNested()
  @ValidatePromise()
  user: Promise<User>;
}
`})}),`
`,e(r.h2,{id:"herdando-decoradores-de-validação",children:"Herdando decoradores de validação"}),`
`,e(r.p,{children:"Quando você define uma subclasse que se estende de outra, a subclasse herdará automaticamente os decoradores do pai. Se uma propriedade for redefinida no descendente, os decoradores de classe serão aplicados a ela tanto de sua própria classe quanto da classe base."}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { validate } from 'archbase-react';

class BaseContent {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

class User extends BaseContent {
  @MinLength(10)
  @MaxLength(20)
  name: string;

  @Contains('Olá')
  welcome: string;

  @MinLength(20)
  password: string;
}

let user = new User();

user.email = 'invalid email'; // propriedade herdada
user.password = 'muito curto'; // a senha será validada não apenas em IsString, mas também em MinLength
user.name = 'not valid';
user.welcome = 'ola';

validate(user).then(errors => {
  // ...
}); // retornará erros para propriedades de e-mail, título e texto
`})}),`
`,e(r.h2,{id:"validação-condicional",children:"Validação condicional"}),`
`,n(r.p,{children:["O decorador de validação condicional (",e(r.code,{children:"@ValidateIf"}),") pode ser usado para ignorar os validadores em uma propriedade quando a função de condição fornecida retorna falso. A função de condição pega o objeto que está sendo validado e deve retornar um ",e(r.code,{children:"booleano"}),"."]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidateIf, IsNotEmpty } from 'archbase-react';

export class Post {
  otherProperty: string;

  @ValidateIf(o => o.otherProperty === 'value')
  @IsNotEmpty()
  example: string;
}
`})}),`
`,n(r.p,{children:["No exemplo acima, as regras de validação aplicadas a ",e(r.code,{children:"example"})," não serão executadas a menos que ",e(r.code,{children:"otherProperty"})," do objeto seja ",e(r.code,{children:'"value"'}),"."]}),`
`,n(r.p,{children:["Observe que quando a condição é falsa, todos os decoradores de validação são ignorados, incluindo ",e(r.code,{children:"isDefined"}),"."]}),`
`,e(r.h2,{id:"lista-de-permissões",children:"Lista de permissões"}),`
`,n(r.p,{children:[`Mesmo que seu objeto seja uma instância de uma classe de validação, ele poderá conter propriedades adicionais que não estão definidas.
Se você não deseja ter tais propriedades em seu objeto, passe um sinalizador especial para o método `,e(r.code,{children:"validate"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { validate } from 'archbase-react';
// ...
validate(post, { whitelist: true });
`})}),`
`,e(r.p,{children:`Isso removerá todas as propriedades que não possuem decoradores. Se nenhum outro decorador for adequado para sua propriedade,
você pode usar o decorador @Allow:`}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import {validate, Allow, Min} from "class-validator";

export class Post {

    @Allow()
    title: string;

    @Min(0)
    views: number;

    nonWhitelistedProperty: number;
}

let post = new Post();
post.title = 'Olá mundo!';
post.views = 420;

post.nonWhitelistedProperty = 69;
(post as any).anotherNonWhitelistedProperty = "something";

validate(post).then(errors => {
  // post.nonWhitelistedProperty não está definido
  // (post as any).anotherNonWhitelistedProperty não está definido
  ...
});
`})}),`
`,n(r.p,{children:[`Se você preferir que um erro seja gerado quando alguma propriedade não incluída na lista de permissões estiver presente, passe outro sinalizador para
Método `,e(r.code,{children:"validar"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { validate } from 'archbase-react';
// ...
validate(post, { whitelist: true, forbidNonWhitelisted: true });
`})}),`
`,e(r.h2,{id:"passando-contexto-para-decoradores",children:"Passando contexto para decoradores"}),`
`,n(r.p,{children:["É possível passar um objeto customizado para decoradores que estará acessível na instância ",e(r.code,{children:"ValidationError"})," da propriedade caso haja falha na validação."]}),`
`,e(r.pre,{children:e(r.code,{className:"language-ts",children:`import { validate } from 'archbase-react';

class MyClass {
  @MinLength(32, {
    message: 'EIC o código deve ter pelo menos 32 caracteres',
    context: {
      errorCode: 1003,
      developerNote: 'A string validada deve conter 32 ou mais caracteres.',
    },
  })
  eicCode: string;
}

const model = new MyClass();

validate(model).then(errors => {
  //errors[0].contexts['minLength'].errorCode === 1003
});
`})}),`
`,e(r.h2,{id:"ignorando-propriedades-ausentes",children:"Ignorando propriedades ausentes"}),`
`,n(r.p,{children:[`Às vezes você pode querer pular a validação das propriedades que não existem no objeto de validação. Isso é
geralmente desejável quando você deseja atualizar algumas partes do objeto e deseja validar apenas as partes atualizadas,
mas pule todo o resto, por ex. pule as propriedades ausentes.
Em tais situações você precisará passar um sinalizador especial para o método `,e(r.code,{children:"validate"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { validate } from 'archbase-react';
// ...
validate(post, { skipMissingProperties: true });
`})}),`
`,n(r.p,{children:[`Ao pular propriedades ausentes, às vezes você não deseja pular todas as propriedades ausentes, algumas delas podem ser necessárias
para você, mesmo que skipMissingProperties esteja definido como verdadeiro. Para tais casos você deve usar o decorador `,e(r.code,{children:"@IsDefined()"}),`.
`,e(r.code,{children:"@IsDefined()"})," é o único decorador que ignora a opção ",e(r.code,{children:"skipMissingProperties"}),"."]}),`
`,e(r.h2,{id:"grupos-de-validação",children:"Grupos de validação"}),`
`,e(r.p,{children:`Em diferentes situações você pode querer usar diferentes esquemas de validação do mesmo objeto.
Nesses casos você pode usar grupos de validação.`}),`
`,n(r.blockquote,{children:[`
`,n(r.p,{children:[e(r.strong,{children:"IMPORTANTE"}),`
Chamar uma validação com uma combinação de grupo que não resultaria em validação (ex: nome de grupo inexistente)
resultará em um erro de valor desconhecido. Ao validar com grupos, a combinação de grupos fornecida deve corresponder a pelo menos um decorador.`]}),`
`]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { validate, Min, Length } from 'archbase-react';

export class User {
  @Min(12, {
    groups: ['registro'],
  })
  age: number;

  @Length(2, 20, {
    groups: ['registro', 'admin'],
  })
  name: string;
}

let user = new User();
user.age = 10;
user.name = 'Alex';

validate(user, {
  groups: ['registro'],
}); // isso não passará na validação

validate(user, {
  groups: ['admin'],
}); // this will pass validation

validate(user, {
  groups: ['registration', 'admin'],
}); // isso não passará na validação

validate(user, {
  groups: undefined, // o padrão
}); // isso não passará na validação, pois todas as propriedades são validadas independentemente de seus grupos

validate(user, {
  groups: [],
}); // isso não passará na validação (equivalente a 'groups: indefinidos', veja acima)
`})}),`
`,n(r.p,{children:["Há também um sinalizador especial ",e(r.code,{children:"always: true"}),` nas opções de validação que você pode usar. Este sinalizador diz que esta validação
deve ser aplicado sempre, independentemente do grupo usado.`]}),`
`,e(r.h2,{id:"classes-de-validação-personalizadas",children:"Classes de validação personalizadas"}),`
`,n(r.p,{children:["Se você tiver uma lógica de validação personalizada, poderá criar uma ",e(r.em,{children:"classe de restrição"}),":"]}),`
`,n(r.ol,{children:[`
`,n(r.li,{children:[`
`,n(r.p,{children:["Primeiro crie um arquivo, digamos ",e(r.code,{children:"CustomTextLength.ts"}),", e defina uma nova classe:"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'archbase-react';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text.length > 1 && text.length < 10; // para validações assíncronas você deve retornar um Promise<boolean> aqui
  }

  defaultMessage(args: ValidationArguments) {
    // aqui você pode fornecer mensagem de erro padrão se falha na validação
    return 'O texto ($value) é muito curto ou muito longo!';
  }
}
`})}),`
`,n(r.p,{children:["Marcamos nossa classe com o decorador ",e(r.code,{children:"@ValidatorConstraint"}),`.
Você também pode fornecer um nome de restrição de validação - esse nome será usado como "tipo de erro" em ValidationError.
Se você não fornecer um nome de restrição, ele será gerado automaticamente.`]}),`
`,n(r.p,{children:["Nossa classe deve implementar a interface ",e(r.code,{children:"ValidatorConstraintInterface"})," e seu método ",e(r.code,{children:"validate"}),`,
que define a lógica de validação. Se a validação for bem-sucedida, o método retornará verdadeiro, caso contrário, falso.
O validador personalizado pode ser assíncrono, se você quiser realizar a validação após alguma assíncrona
operações, simplesmente retorne uma promessa com booleano dentro do método `,e(r.code,{children:"validate"}),"."]}),`
`,n(r.p,{children:["Também definimos o método opcional ",e(r.code,{children:"defaultMessage"}),` que define uma mensagem de erro padrão,
caso a implementação do decorador não defina uma mensagem de erro.`]}),`
`]}),`
`,n(r.li,{children:[`
`,e(r.p,{children:"Então você pode usar sua nova restrição de validação em sua classe:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { Validate } from 'archbase-react';
import { CustomTextLength } from './CustomTextLength';

export class Post {
  @Validate(CustomTextLength, {
    message: 'O título é muito curto ou longo!',
  })
  title: string;
}
`})}),`
`,n(r.p,{children:["Aqui definimos nossa restrição de validação ",e(r.code,{children:"CustomTextLength"})," recém-criada para ",e(r.code,{children:"Post.title"}),"."]}),`
`]}),`
`,n(r.li,{children:[`
`,e(r.p,{children:"And use validator as usual:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { validate } from 'archbase-react';

validate(post).then(errors => {
  // ...
});
`})}),`
`]}),`
`]}),`
`,e(r.p,{children:"Você também pode passar restrições para o seu validador, assim:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { Validate } from 'archbase-react';
import { CustomTextLength } from './CustomTextLength';

export class Post {
  @Validate(CustomTextLength, [3, 20], {
    message: 'Wrong post title',
  })
  title: string;
}
`})}),`
`,n(r.p,{children:["E use-os no objeto ",e(r.code,{children:"validationArguments"}),":"]}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'archbase-react';

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    return text.length > validationArguments.constraints[0] && text.length < validationArguments.constraints[1];
  }
}
`})}),`
`,e(r.h2,{id:"decoradores-de-validação-personalizados",children:"Decoradores de validação personalizados"}),`
`,n(r.p,{children:[`Você também pode criar decoradores personalizados. É a maneira mais elegante de usar validações personalizadas.
Vamos criar um decorador chamado `,e(r.code,{children:"@IsLongerThan"}),":"]}),`
`,n(r.ol,{children:[`
`,n(r.li,{children:[`
`,e(r.p,{children:"Crie você mesmo um decorador:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { registerDecorator, ValidationOptions, ValidationArguments } from 'archbase-react';

export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length; // você pode retornar um Promise<boolean> aqui também, se quiser fazer uma validação assíncrona
        },
      },
    });
  };
}
`})}),`
`]}),`
`,n(r.li,{children:[`
`,e(r.p,{children:"Coloque-o em uso:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { IsLongerThan } from './IsLongerThan';

export class Post {
  title: string;

  @IsLongerThan('title', {
    /* você também pode usar opções de validação adicionais, como "grupos" em seus decoradores de validação personalizados. "each" não é suportado */
    message: 'O texto deve ser maior que o título',
  })
  text: string;
}
`})}),`
`]}),`
`]}),`
`,n(r.p,{children:["Em seus decoradores personalizados você também pode usar ",e(r.code,{children:"ValidationConstraint"}),`.
Vamos criar outro decorador de validação personalizado chamado `,e(r.code,{children:"IsUserAlreadyExist"}),":"]}),`
`,n(r.ol,{children:[`
`,n(r.li,{children:[`
`,e(r.p,{children:"Crie um ValidationConstraint e um decorador:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'archbase-react';

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    return UserRepository.findOneByName(userName).then(user => {
      if (user) return false;
      return true;
    });
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
`})}),`
`]}),`
`]}),`
`,n(r.p,{children:["Observe que marcamos nossa restrição de que será assíncrono adicionando ",e(r.code,{children:"{ async: true }"})," nas opções de validação."]}),`
`,n(r.ol,{start:"2",children:[`
`,n(r.li,{children:[`
`,e(r.p,{children:"E coloque-o em uso:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { IsUserAlreadyExist } from './IsUserAlreadyExist';

export class User {
  @IsUserAlreadyExist({
    message: 'O usuário $value já existe. Escolha outro nome.',
  })
  name: string;
}
`})}),`
`]}),`
`]}),`
`,e(r.h2,{id:"validação-síncrona",children:"Validação síncrona"}),`
`,n(r.p,{children:["Se você deseja realizar uma validação simples não assíncrona, você pode usar o método ",e(r.code,{children:"validateSync"})," em vez do ",e(r.code,{children:"validate"}),` regular
método. Tem os mesmos argumentos do método `,e(r.code,{children:"validate"}),". Mas observe que este método ",e(r.strong,{children:"ignora"}),` todas as validações assíncronas
você tem.`]}),`
`,e(r.h2,{id:"validação-manual",children:"Validação manual"}),`
`,e(r.p,{children:"Existem vários métodos no Validador que permitem realizar validação não baseada em decorador:"}),`
`,e(r.pre,{children:e(r.code,{className:"language-typescript",children:`import { isEmpty, isBoolean } from 'archbase-react';

isEmpty(value);
isBoolean(value);
`})}),`
`,e(r.h2,{id:"decoradores-de-validação",children:"Decoradores de validação"}),`
`,n("table",{children:[n("tr",{children:[e("th",{children:"Decorador"}),e("td",{children:"Descrição"})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação comuns"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsDefined(value: any)"})}),e("td",{children:"Verifica se o valor está definido (!== undefined, !== null). Este é o único decorador que ignora a opção skipMissingProperties."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsOptional()"})}),e("td",{children:"Verifica se o valor fornecido está vazio (=== null, === undefined) e se sim, ignora todos os validadores na propriedade."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Equals(comparison: any)"})}),e("td",{children:'Verifica se o valor é igual ("===") comparação.'})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@NotEquals(comparison: any)"})}),e("td",{children:'Verifica se o valor não é igual ("!==") comparação.'})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsEmpty()"})}),e("td",{children:"Verifica se o valor fornecido está vazio (=== '', === null, === undefined)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNotEmpty()"})}),e("td",{children:"Verifica se o valor fornecido não está vazio (!== '', !== null, !== undefined)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsIn(values: any[])"})}),e("td",{children:"Verifica se o valor está em uma matriz de valores permitidos."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNotIn(values: any[])"})}),e("td",{children:"Verifica se o valor não está em uma matriz de valores não permitidos."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação de tipo"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBoolean()"})}),e("td",{children:"Verifica se um valor é booleano."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsDate()"})}),e("td",{children:"Verifica se o valor é uma data."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsString()"})}),e("td",{children:"Verifica se o valor é uma string."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNumber(options: IsNumberOptions)"})}),e("td",{children:"Verifica se o valor é um número."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsInt()"})}),e("td",{children:"Verifica se o valor é um número inteiro."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsArray()"})}),e("td",{children:"Verifica se o valor é um array."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsEnum(entity: object)"})}),e("td",{children:"Verifica se o valor é um enum válido."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação de número"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsDivisibleBy(num: number)"})}),e("td",{children:"Verifica se o valor é um número divisível por outro."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsPositive()"})}),e("td",{children:"Verifica se o valor é um número positivo maior que zero."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNegative()"})}),e("td",{children:"Verifica se o valor é um número negativo menor que zero."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Min(min: number)"})}),e("td",{children:"Verifica se o número fornecido é maior ou igual ao número fornecido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Max(max: number)"})}),e("td",{children:"Verifica se o número fornecido é menor ou igual ao número fornecido."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação de data"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@MinDate(date: Date \\| (() =&gt; Date))"})}),e("td",{children:"Verifica se o valor é uma data posterior à data especificada."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@MaxDate(date: Date \\| (() =&gt; Date))"})}),e("td",{children:"Verifica se o valor é uma data anterior à data especificada."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação do tipo string"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBooleanString()"})}),e("td",{children:'Verifica se uma string é booleana (por exemplo, é "true" ou "false" ou "1", "0").'})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsDateString()"})}),n("td",{children:["Alias ​​para ",e(r.code,{children:"@IsISO8601()"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNumberString(options?: IsNumericOptions)"})}),e("td",{children:"Verifica se uma string é um número."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação de string"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Contains(seed: string)"})}),e("td",{children:"Verifica se a string contém a semente."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@NotContains(seed: string)"})}),e("td",{children:"Verifica se a string não contém a semente."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsAlpha()"})}),e("td",{children:"Verifica se a string contém apenas letras (a-zA-Z)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsAlphanumeric()"})}),e("td",{children:"Verifica se a string contém apenas letras e números."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsDecimal(options?: IsDecimalOptions)"})}),n("td",{children:["Verifica se a string é um valor decimal válido. As IsDecimalOptions padrão são ",e(r.code,{children:"force_decimal=False"}),", ",e(r.code,{children:"decimal_digits: &#39;1,&#39;"}),", ",e(r.code,{children:"locale: &#39;en-US&#39;"})]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsAscii()"})}),e("td",{children:"Verifica se a string contém apenas caracteres ASCII."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBase32()"})}),e("td",{children:"Verifica se uma string é codificada em base32."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBase58()"})}),e("td",{children:"Verifica se uma string está codificada em base58."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBase64(options?: IsBase64Options)"})}),e("td",{children:"Verifica se uma string é codificada em base64."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsIBAN()"})}),e("td",{children:"Verifica se uma string é um IBAN (Número Internacional de Conta Bancária)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBIC()"})}),e("td",{children:"Verifica se uma string é um código BIC (Código de Identificação Bancária) ou SWIFT."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsByteLength(min: number, max?: number)"})}),e("td",{children:"Verifica se o comprimento da string (em bytes) está dentro de um intervalo."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsCreditCard()"})}),e("td",{children:"Verifica se a string é um cartão de crédito."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsCurrency(options?: IsCurrencyOptions)"})}),e("td",{children:"Verifica se a string é um valor monetário válido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISO4217CurrencyCode()"})}),e("td",{children:"Verifica se a string é um código de moeda ISO 4217."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsEthereumAddress()"})}),e("td",{children:"Verifica se a string é um endereço Ethereum usando regex básico. Não valida somas de verificação de endereço."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsBtcAddress()"})}),e("td",{children:"Verifica se a string é um endereço BTC válido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsDataURI()"})}),e("td",{children:"Verifica se a string é um formato uri de dados."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsEmail(options?: IsEmailOptions)"})}),e("td",{children:"Verifica se a string é um email."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsFQDN(options?: IsFQDNOptions)"})}),e("td",{children:"Verifica se a string é um nome de domínio totalmente qualificado (por exemplo, domínio.com)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsFullWidth()"})}),e("td",{children:"Verifica se a string contém caracteres de largura total."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsHalfWidth()"})}),e("td",{children:"Verifica se a string contém caracteres de meia largura."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsVariableWidth()"})}),e("td",{children:"Verifica se a string contém uma mistura de caracteres completos e de meia largura."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsHexColor()"})}),e("td",{children:"Verifica se a string tem uma cor hexadecimal."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsHSL()"})}),n("td",{children:["Verifica se a string é uma cor HSL com base na ",e(r.a,{href:"https://developer.mozilla.org/en-US/docs/Web/CSS/color_value",target:"_blank",rel:"nofollow noopener noreferrer",children:"especificação de cores CSS nível 4"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsRgbColor(options?: IsRgbOptions)"})}),e("td",{children:"Verifica se a string é de cor rgb ou rgba."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsIdentityCard(locale?: string)"})}),e("td",{children:"Verifica se a string é um código de carteira de identidade válido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsPassportNumber(countryCode?: string)"})}),e("td",{children:"Verifica se a string é um número de passaporte válido relativo a um código de país específico."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsPostalCode(locale?: string)"})}),e("td",{children:"Verifica se a string é um código postal."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsHexadecimal()"})}),e("td",{children:"Verifica se a string é um número hexadecimal."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsOctal()"})}),e("td",{children:"Verifica se a string é um número octal."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMACAddress(options?: IsMACAddressOptions)"})}),e("td",{children:"Verifica se a string é um endereço MAC."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsIP(version?: &quot;4&quot;\\|&quot;6&quot;)"})}),e("td",{children:"Verifica se a string é um IP (versão 4 ou 6)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsPort()"})}),e("td",{children:"Verifica se a string é um número de porta válido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISBN(version?: &quot;10&quot;\\|&quot;13&quot;)"})}),e("td",{children:"Verifica se a string é um ISBN (versão 10 ou 13)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsEAN()"})}),e("td",{children:"Verifica se a string é um EAN (número de artigo europeu)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISIN()"})}),e("td",{children:"Verifica se a string é um ISIN (identificador de estoque/título)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISO8601(options?: IsISO8601Options)"})}),e("td",{children:"Verifica se a string é um formato de data ISO 8601 válido. Use a opção strict = true para verificações adicionais de uma data válida."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsJSON()"})}),e("td",{children:"Verifica se a string é JSON válida."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsJWT()"})}),e("td",{children:"Verifica se a string é JWT válida."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsObject()"})}),e("td",{children:"Verifica se o objeto é válido (nulo, funções, arrays retornarão falso)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNotEmptyObject()"})}),e("td",{children:"Verifica se o objeto não está vazio."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsLowercase()"})}),e("td",{children:"Verifica se a string está em minúsculas."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsLatLong()"})}),e("td",{children:"Verifica se a string é uma coordenada de latitude-longitude válida no formato lat, long."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsLatitude()"})}),e("td",{children:"Verifica se a string ou número é uma coordenada de latitude válida."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsLongitude()"})}),e("td",{children:"Verifica se a string ou número é uma coordenada de longitude válida."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMobilePhone(locale: string)"})}),e("td",{children:"Verifica se a string é um número de celular."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISO31661Alpha2()"})}),e("td",{children:"Verifica se a string é um código de país válido ISO 3166-1 alfa-2 oficialmente atribuído."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISO31661Alpha3()"})}),e("td",{children:"Verifica se a string é um código de país válido ISO 3166-1 alfa-3 oficialmente atribuído."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsLocale()"})}),e("td",{children:"Verifica se a string é uma localidade."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsPhoneNumber(region: string)"})}),e("td",{children:"Verifica se a string é um número de telefone válido usando libphonenumber-js."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMongoId()"})}),e("td",{children:"Verifica se a string é uma representação codificada em hexadecimal válida de um ObjectId do MongoDB."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMultibyte()"})}),e("td",{children:"Verifica se a string contém um ou mais caracteres multibyte."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsNumberString(options?: IsNumericOptions)"})}),e("td",{children:"Verifica se a string é numérica."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsSurrogatePair()"})}),e("td",{children:"Verifica se a string contém quaisquer caracteres de pares substitutos."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsTaxId()"})}),n("td",{children:["Verifica se a string é um ID fiscal válido. A localidade padrão é ",e(r.code,{children:"en-US"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsUrl(options?: IsURLOptions)"})}),e("td",{children:"Verifica se a string é uma URL."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMagnetURI()"})}),n("td",{children:["Verifica se a string é um ",e(r.a,{href:"https://en.wikipedia.org/wiki/Magnet_URI_scheme",target:"_blank",rel:"nofollow noopener noreferrer",children:"formato de uri magnético"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsUUID(version?: UUIDVersion)"})}),e("td",{children:"Verifica se a string é um UUID (versão 3, 4, 5 ou todas)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsFirebasePushId()"})}),n("td",{children:["Verifica se a string é um ",e(r.a,{href:"https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html",target:"_blank",rel:"nofollow noopener noreferrer",children:"Firebase Push ID"})]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsUppercase()"})}),e("td",{children:"Verifica se a string está em maiúscula."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Length(min: number, max?: number)"})}),e("td",{children:"Verifica se o comprimento da string está dentro de um intervalo."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@MinLength(min: number)"})}),e("td",{children:"Verifica se o comprimento da string não é menor que o número fornecido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@MaxLength(max: number)"})}),e("td",{children:"Verifica se o comprimento da string não é maior que o número fornecido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Matches(pattern: RegExp, modifiers?: string)"})}),e("td",{children:"Verifica se a string corresponde ao padrão. Corresponde('foo', /foo/i) ou corresponde('foo', 'foo', 'i')."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMilitaryTime()"})}),e("td",{children:"Verifica se a string é uma representação válida do horário militar no formato HH:MM."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsTimeZone()"})}),e("td",{children:"Verifica se a string representa um fuso horário IANA válido."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsHash(algorithm: string)"})}),n("td",{children:["Verifica se a string é um hash Os seguintes tipos são suportados:",e(r.code,{children:"md4"}),", ",e(r.code,{children:"md5"}),", ",e(r.code,{children:"sha1"}),", ",e(r.code,{children:"sha256"}),", ",e(r.code,{children:"sha384"}),", ",e(r.code,{children:"sha512"}),", ",e(r.code,{children:"ripemd128"}),", ",e(r.code,{children:"ripemd160"}),", ",e(r.code,{children:"tiger128"}),", ",e(r.code,{children:"tiger160"}),", ",e(r.code,{children:"tiger192"}),", ",e(r.code,{children:"crc32"}),", ",e(r.code,{children:"crc32b"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsMimeType()"})}),n("td",{children:["Verifica se a string corresponde a um [tipo MIME] formato válido(",e(r.a,{href:"https://en.wikipedia.org/wiki/Media_type",target:"_blank",rel:"nofollow noopener noreferrer",children:"https://en.wikipedia.org/wiki/Media_type"}),")"]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsSemVer()"})}),e("td",{children:"Verifica se a string é uma especificação de versionamento semântico (SemVer)."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISSN(options?: IsISSNOptions)"})}),e("td",{children:"Verifica se a string é um ISSN."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsISRC()"})}),n("td",{children:["Verifica se a string é um ",e(r.a,{href:"https://en.wikipedia.org/wiki/International_Standard_Recording_Code",target:"_blank",rel:"nofollow noopener noreferrer",children:"ISRC"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsRFC3339()"})}),n("td",{children:["Verifica se a string é uma data válida ",e(r.a,{href:"https://tools.ietf.org/html/rfc3339",target:"_blank",rel:"nofollow noopener noreferrer",children:"RFC 3339"}),"."]})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsStrongPassword(options?: IsStrongPasswordOptions)"})}),e("td",{children:"Verifica se a string é uma senha forte."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação de array"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@ArrayContains(values: any[])"})}),e("td",{children:"Verifica se a matriz contém todos os valores da matriz de valores fornecida."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@ArrayNotContains(values: any[])"})}),e("td",{children:"Verifica se o array não contém nenhum dos valores fornecidos."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@ArrayNotEmpty()"})}),e("td",{children:"Verifica se determinado array não está vazio."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@ArrayMinSize(min: number)"})}),e("td",{children:"Verifica se o comprimento do array é maior ou igual ao número especificado."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@ArrayMaxSize(max: number)"})}),e("td",{children:"Verifica se o comprimento do array é menor ou igual ao número especificado."})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@ArrayUnique(identifier?: (o) =&gt; any)"})}),e("td",{children:"Verifica se todos os valores do array são únicos. A comparação de objetos é baseada em referência. A função opcional pode ser especificada qual valor de retorno será usado para a comparação."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Decoradores de validação de objeto"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@IsInstance(value: any)"})}),e("td",{children:"Verifica se a propriedade é uma instância do valor passado."})]}),n("tr",{children:[e("th",{children:e(r.strong,{children:"Outros decoradores"})}),e("td",{})]}),n("tr",{children:[e("th",{children:e(r.code,{children:"@Allow()"})}),e("td",{children:"Evite a remoção da propriedade quando nenhuma outra restrição for especificada para ela."})]}),n("tr",{children:[e("th",{}),e("td",{})]})]}),`
`,e(r.h2,{id:"validando-objetos-simples",children:"Validando objetos simples"}),`
`,n(r.p,{children:["Devido à natureza dos decoradores, o objeto validado deve ser instanciado usando a sintaxe ",e(r.code,{children:"new Class()"}),`.
Se você tem sua classe definida usando decoradores validadores de classe e deseja validar um objeto JS simples (objeto literal ou retornado por JSON.parse),
você precisa transformá-lo na instância da classe usando [class-transformer](https:/ /github.com/pleerock/class-transformer)).`]})]})}function M(a={}){const{wrapper:r}=Object.assign({},i(),a.components);return r?e(r,Object.assign({},a,{children:e(o,a)})):o(a)}export{M as default};
