import{R as O,r as _}from"./index-8b3efc3f.js";import{i as v}from"./i18next-a4b2730f.js";import{a as ie,A as we,b as y,D as S}from"./useArchbaseDataSourceListener-92dd263c.js";import{j as L}from"./jsx-runtime-c9381026.js";import{p as b}from"./ArchbaseErrorHelper-1b9b234b.js";import{D as se}from"./ArchbaseRemoteApiService-19607a49.js";const d={IS:"IS",BETWEEN:"BETWEEN",LIKE:"LIKE",EQ:"EQ",NEQ:"NEQ",GEQ:"GEQ",LEQ:"LEQ",GT:"GT",LT:"LT",NOT:"NOT",IN:"IN",IS_NOT:"IS_NOT",AND:"AND",OR:"OR"};function V(i,e){const t=Object.prototype.toString.call(e).slice(8,-1);return e!=null&&t===i}function xe(i){return i===d.IS||i===d.BETWEEN||i===d.LIKE||i===d.EQ||i===d.NEQ||i===d.GEQ||i===d.LEQ||i===d.GT||i===d.LT||i===d.NOT||i===d.IN||i===d.IS_NOT||i===d.AND||i===d.OR}const g={FIELD:"FIELD",FILTER:"FILTER",GROUP:"GROUP",OPERATION:"OPERATION",AND:"AND",OR:"OR",IN:"IN",BETWEEN:"BETWEEN"};class n{constructor(e){this.message=e,this.name="FilterException"}}class q{constructor(e,t){this.fieldName=e,this.fieldSql=t,this.expressionType=g.FIELD}getFieldName(){return this.fieldName()}setFieldName(e){this.fieldName=e}toJSON(e){e.append('"type" : "FIELD",'),e.append('"name" : "'+this.fieldName+'"'),this.fieldSql&&e.append(', "nameSql" : "'+this.fieldSql+'"')}}class W{constructor(){this.expressionType=g.FILTER}applyOperation(e,t){throw new n("applyOperation só pode ser usado nas classes concretas.")}applyInOperation(){throw new n("applyInOperation só pode ser usado nas classes concretas.")}applyNotInOperation(){throw new n("applyNotInOperation só pode ser usado nas classes concretas.")}applyBetweenOperation(){throw new n("applyBetweenOperation só pode ser usado nas classes concretas.")}EQ(e){return this.applyOperation(d.EQ,e)}NEQ(e){return this.applyOperation(d.NEQ,e)}GEQ(e){return this.applyOperation(d.GEQ,e)}GT(e){return this.applyOperation(d.GT,e)}LT(e){return this.applyOperation(d.LT,e)}AND(){if(arguments.length===3)return new B(this,new x(arguments[0],arguments[1],arguments[2]));if(arguments.length===1)if(typeof arguments[0]=="object"){if(arguments[0].expressionType===void 0)throw new n("Tipo de parâmetro incorreto para uso de AND. Parâmetro "+arguments[0]);return arguments[0].expressionType===g.FIELD?new B(this,new x(arguments[0])):new B(this,arguments[0])}else throw new n("Parâmetro deve ser do tipo Object.");else throw new n("Número de parâmetros incorretos para a chamade de AND")}OR(){if(arguments.length===4)return new C(this,new C(arguments[0],arguments[1],arguments[2]));if(arguments.length===1)if(typeof arguments[0]=="object"){if(arguments[0].expressionType===void 0)throw new n("Tipo de parâmetro incorreto para uso de OR. Parâmetro "+arguments[0]);return arguments[0].expressionType===g.FIELD?new C(this,new x(arguments[0])):new C(this,arguments[0])}else throw new n("Parâmetro deve ser do tipo Object.");else throw new n("Número de parâmetros incorretos para a chamade de OR")}LEQ(e){return this.applyOperation(d.LEQ,e)}LIKE(e){return this.applyOperation(d.LIKE,e)}BETWEEN(e,t){return this.applyBetweenOperation(e,t)}STARTSWITH(e){if(ArchbaseStringUtils.isEmpty(e))throw new n("Para usar STARTSWITH informe um valor.");return e=e.concat("%"),this.applyOperation(d.LIKE,e)}ENDSWITH(e){if(ArchbaseStringUtils.isEmpty(e))throw new n("Para usar ENDSWITH informe um valor.");return e="%".concat(e),this.applyOperation(d.LIKE,e)}CONTAINS(e){if(ArchbaseStringUtils.isEmpty(e))throw new n("Para usar v informe um valor.");return e="%".concat(e.concat("%")),this.applyOperation(d.LIKE,e)}IN(){return this.applyInOperation(arguments[0])}NOTIN(){return this.applyNotInOperation(arguments[0])}ISNULL(){return this.applyOperation(d.IS,"NULL")}ISNOTNULL(){return this.applyOperation(d.IS_NOT,"NULL")}toJSON(e){throw new n("toJSON deve ser implementado nas classes concretas herdadas de FilterExpression.")}}class x extends W{constructor(e,t,r){super(),this.lhsValue=e,this.rhsValue=r,this.operator=t,this.expressionType=g.OPERATION}applyOperation(e,t){if(!xe(e))throw new n(e+" não é um operador válido.");if(this.operator!==void 0)throw new n("Não é possível aplicar "+e+" operation on an "+this.operator+" expression.");return new x(this.lhsValue,e,t)}applyInOperation(){if(arguments[0].length===0)throw new n("Para usar operação IN é necessário informar os valores.");if(!(this.lhsValue instanceof q))throw new n("Somente é possível aplicar a operação 'IN' em uma coluna.");return new ae(this.lhsValue,!1,arguments[0])}applyNotInOperation(){if(arguments[0].length===0)throw new n("Para usar operação NOT IN é necessário informar os valores.");if(!(this.lhsValue instanceof q))throw new n("Somente é possível aplicar a operação 'NOT IN' em uma coluna.");return new ae(this.lhsValue,!0,arguments[0])}applyBetweenOperation(e,t){if(e===void 0)throw new n("Para usar operação BETWEEN é necessário informar o valor inicial.");if(t===void 0)throw new n("Para usar operação BETWEEN é necessário informar o valor final.");if(!(this.lhsValue instanceof q))throw new n("Somente é possível aplicar a operação 'BETWEEN' em uma coluna.");return new ve(this.lhsValue,e,t)}toJSON(e){e.append('"type" : "OP",'),e.append('"lhsValue" : {'),this.lhsValue.toJSON(e),e.append("},"),V("Number",this.rhsValue)?e.append('"rhsValue" : '+this.rhsValue+","):e.append('"rhsValue" : "'+this.rhsValue+'",'),e.append('"operator" : "'+this.operator+'"')}}class ce extends W{constructor(e){super(),this.expressions=e,this.expressionType=g.GROUP}getExpressions(){return this.expressions}getOperator(){throw new n("Uso incorreto do método. Este método deve ser implementado por classes concretas que herdam de GroupExpression.")}applyOperation(e,t){const r=this.expressions.length-1,s=this.expressions[r];return this.expressions[r]=s.applyOperation(e,t),this}applyInOperation(){const e=this.expressions.length-1,t=this.expressions[e];return this.expressions[e]=t.applyInOperation(arguments[0]),this}applyNotInOperation(){const e=this.expressions.length-1,t=this.expressions[e];return this.expressions[e]=t.applyNotInOperation(arguments[0]),this}applyBetweenOperation(e,t){const r=this.expressions.length-1,s=this.expressions[r];return this.expressions[r]=s.applyBetweenOperation(e,t),this}toJSON(e){e.append('"type" : "'+this.getOperator()+'",'),e.append('"expressions" : [');let t=!1;for(let r=0;r<this.expressions.length;r++)t&&e.append(","),e.append("{"),this.expressions[r].toJSON(e),e.append("}"),t=!0;e.append("]")}}class ae extends W{constructor(){if(super(),arguments.length<3)throw new n("Para usar a expressão IN informe os parâmetros corretamente.");this.field=arguments[0],this.negative=arguments[1],this.values=arguments[2],this.expressionType=g.IN}isNegative(){return this.negative}applyOperation(e,t){throw new n("Não é possível aplicar a operação "+e+" na expressão IN.")}applyInOperation(){throw new n("Não é possível aplicar a operação IN na expressão IN.")}applyNotInOperation(){throw new n("Não é possível aplicar a operação NOT IN na expressão IN.")}applyBetweenOperation(e,t){throw new n("Não é possível aplicar a operação BETWEEEN na expressão IN.")}toJSON(e){e.append('"type" : "IN",'),e.append('"field" : {'),this.field.toJSON(e),e.append("},"),e.append('"values" : [');let t=!1;for(let r=0;r<this.values.length;r++)t&&e.append(","),V("Number",this.values[r])?e.append(this.values[r]):e.append('"'+this.values[r]+'"'),t=!0;e.append("],"),e.append('"negative" : '+this.negative)}}class ve extends W{constructor(e,t,r){if(super(),e===void 0)throw new n("Informe o valor do field para usar BETWEEN.");if(t===void 0)throw new n("Informe o valor inicial para usar BETWEEN.");if(r===void 0)throw new n("Informe o valor final para usar BETWEEN.");this.field=e,this.valueStart=t,this.valueEnd=r,this.expressionType=g.BETWEEN}applyOperation(e,t){throw new n("Não é possível aplicar a operação "+e+" na expressão BETWEEN.")}applyInOperation(){throw new n("Não é possível aplicar a operação IN na expressão BETWEEN.")}applyNotInOperation(){throw new n("Não é possível aplicar a operação NOT IN na expressão BETWEEN.")}applyBetweenOperation(e,t){throw new n("Não é possível aplicar a operação BETWEEEN na expressão BETWEEN.")}toJSON(e){e.append('"type" : "BETWEEN",'),e.append('"field" : {'),this.field.toJSON(e),e.append("},"),V("Number",this.valueStart)?e.append('"valueStart" : '+this.valueStart+","):e.append('"valueStart" : "'+this.valueStart+'",'),V("Number",this.valueEnd)?e.append('"valueEnd" : '+this.valueEnd):e.append('"valueEnd" : "'+this.valueEnd+'"')}}class B extends ce{constructor(){const e=[];for(let t=0;t<arguments.length;t++)e.push(arguments[t]);super(e),this.expressionType=g.AND}getOperator(){return d.AND}}class C extends ce{constructor(){const e=[];for(let t=0;t<arguments.length;t++)e.push(arguments[t]);super(e),this.expressionType=g.OR}getOperator(){return d.OR}}class be{constructor(){this.filterExpression=null,this.fieldsToSort=[],this.processRules=this.processRules.bind(this),this.WHERE=this.WHERE.bind(this),this.EQ=this.EQ.bind(this),this.NEQ=this.NEQ.bind(this),this.GEQ=this.GEQ.bind(this),this.LEQ=this.LEQ.bind(this),this.GT=this.GT.bind(this),this.LT=this.LT.bind(this),this.LIKE=this.LIKE.bind(this),this.IN=this.IN.bind(this),this.NOTIN=this.NOTIN.bind(this),this.AND=this.AND.bind(this),this.OR=this.OR.bind(this),this.ISNULL=this.ISNULL.bind(this),this.ISNOTNULL=this.ISNOTNULL.bind(this),this.betweenOrOp=this.betweenOrOp.bind(this),this.BETWEEN=this.BETWEEN.bind(this),this.OP=this.OP.bind(this),this.STARTSWITH=this.STARTSWITH.bind(this),this.CONTAINS=this.CONTAINS.bind(this),this.toJSON=this.toJSON.bind(this)}assertWhereClauseIsInitialized(e){if(this.filterExpression===null||this.filterExpression===void 0)throw new n("Não é possível aplicar '"+e+"' operador se o cláusula WHERE não existir.")}buildFrom(e,t){e.rules&&(this.processRules(e.condition,e.rules,!0),t&&t.sortFields&&t.sortFields.forEach(r=>{r.selected&&this.fieldsToSort.push(r.name+" "+r.asc_desc)}))}processRules(e,t,r){t.forEach(s=>{if(s.field&&!s.disabled){let o=_this.AND;e==="or"&&(o=_this.OR),r&&(o=_this.WHERE);let a=s.value,p=s.value2;a&&a!==""&&(s.dataType==="date"?a=ArchbaseDateUtils.formatDate(ArchbaseDateUtils.parseDateWithFormat(a,"DD/MM/YYYY"),Archbase.dataSourceDatetimeFormat):s.dataType==="date_time"&&(a=ArchbaseDateUtils.formatDate(ArchbaseDateUtils.parseDateWithFormat(a,"DD/MM/YYYY hh:mm:ss"),Archbase.dataSourceDatetimeFormat))),p&&p!==""&&(s.dataType==="date"?p=ArchbaseDateUtils.formatDate(ArchbaseDateUtils.parseDateWithFormat(p,"DD/MM/YYYY"),Archbase.dataSourceDatetimeFormat):s.dataType==="date_time"&&(p=ArchbaseDateUtils.formatDate(ArchbaseDateUtils.parseDateWithFormat(p,"DD/MM/YYYY hh:mm:ss"),Archbase.dataSourceDatetimeFormat))),s.operator==="null"?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).ISNULL(),r=!1):s.operator==="notNull"?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).ISNOTNULL(),r=!1):s.operator==="contains"&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).CONTAINS(a),r=!1):s.operator==="startsWith"&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).STARTSWITH(a),r=!1):s.operator==="endsWith"&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).ENDSWITH(a),r=!1):s.operator==="="&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).EQ(a),r=!1):s.operator==="!="&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).NEQ(a),r=!1):s.operator==="<"&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).LT(a),r=!1):s.operator===">"&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).GT(a),r=!1):s.operator==="<="&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).LEQ(a),r=!1):s.operator===">="&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).GEQ(a),r=!1):s.operator==="between"&&a&&a!==""&&p&&p!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).BETWEEN(a,p),r=!1):s.operator==="inList"&&a&&a!==""?(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).IN(a),r=!1):s.operator==="notInList"&&a&&a!==""&&(o(_this.EXP(_this.FIELD(s.field,s.fieldSql))).NOTIN(a),r=!1)}}),t.forEach(s=>{s.rules&&this.processRules(s.condition,s.rules,r)})}FIELD(e,t){return new q(e,t)}EXP(e){return new x(e)}WHERE(){if(arguments.length<1)throw new n("Para criar uma condição WHERE informe ao menos um parâmetro.");return arguments.length===3?arguments[2]!==void 0&&(this.filterExpression=new x(arguments[0],arguments[1],arguments[2])):(this.filterExpression=arguments[0],arguments[0].expressionType!==void 0&&arguments[0].expressionType===g.FIELD&&(this.filterExpression=new x(arguments[0]))),this}EQ(e){return this.assertWhereClauseIsInitialized("eq"),this.filterExpression=this.filterExpression.EQ(e),this}NEQ(e){return this.assertWhereClauseIsInitialized("neq"),this.filterExpression=this.filterExpression.NEQ(e),this}GEQ(e){return this.assertWhereClauseIsInitialized("geq"),this.filterExpression=this.filterExpression.GEQ(e),this}LEQ(e){return this.assertWhereClauseIsInitialized("leq"),this.filterExpression=this.filterExpression.LEQ(e),this}GT(e){return this.assertWhereClauseIsInitialized("gt"),this.filterExpression=this.filterExpression.GT(e),this}LT(e){return this.assertWhereClauseIsInitialized("lt"),this.filterExpression=this.filterExpression.LT(e),this}LIKE(e){return this.assertWhereClauseIsInitialized("like"),this.filterExpression=this.filterExpression.LIKE(e),this}IN(){const e=[];for(let t=0;t<arguments.length;t++)e.push(arguments[t]);return this.assertWhereClauseIsInitialized("in"),this.filterExpression=this.filterExpression.IN(e),this}NOTIN(){const e=[];for(let t=0;t<arguments.length;t++)e.push(arguments[t]);return this.assertWhereClauseIsInitialized("not in"),this.filterExpression=this.filterExpression.NOTIN(e),this}AND(e){return this.assertWhereClauseIsInitialized("and"),this.filterExpression=this.filterExpression.AND(e),this}OR(e){return this.assertWhereClauseIsInitialized("or"),this.filterExpression=this.filterExpression.OR(e),this}ISNULL(){return this.assertWhereClauseIsInitialized("isNull"),this.filterExpression=this.filterExpression.ISNULL(),this}ISNOTNULL(){return this.assertWhereClauseIsInitialized("isNotNull"),this.filterExpression=this.filterExpression.ISNOTNULL(),this}betweenOrOp(e,t,r){return this.assertWhereClauseIsInitialized(e),this.filterExpression=this.filterExpression.betweenOrOp(e,t,r),this}BETWEEN(e,t){return this.assertWhereClauseIsInitialized("between"),this.filterExpression=this.filterExpression.BETWEEN(e,t),this}OP(e,t){return this.assertWhereClauseIsInitialized(e),this.filterExpression=this.filterExpression.applyOperation(e,t),this}STARTSWITH(e){return this.assertWhereClauseIsInitialized("startsWith"),this.filterExpression=this.filterExpression.STARTSWITH(e),this}CONTAINS(e){return this.assertWhereClauseIsInitialized("contains"),this.filterExpression=this.filterExpression.CONTAINS(e),this}SORTBY(e,t){e instanceof q?this.fieldsToSort.push(e.getFieldName+(t===!0?" DESC":" ASC")):this.fieldsToSort.push(e+(t===!0?" DESC":" ASC"))}toJSON(){if(this.filterExpression!==void 0&&this.filterExpression!=null){const e=ArchbaseStringUtils.createStringBuilder();e.append("{"),e.append('   "filterExpression" : {'),this.filterExpression.toJSON(e),e.append("}, "),e.append('    "fieldsToSort" : [');let t=!1;return this.fieldsToSort.forEach(function(r){t===!0&&e.append(", "),e.append('{ "field" : "'+r+'" }'),t=!0}),e.append("]"),e.append("}"),e.toString()}}}const ze=-2,He=-1,Oe="normal",De="quick",Le="advanced",Me="contains",Je="=";class U{constructor(){}get id(){return this._id}get companyId(){return this._companyId}get filter(){return this._filter}get name(){return this._name}get viewName(){return this._viewName}get componentName(){return this._componentName}get userName(){return this._userName}get isShared(){return this._shared}get code(){return this._code}get isNewFilter(){return this._isNewFilter}setId(e){this._id=e}setCompanyId(e){this._companyId=e}setFilter(e){this._filter=e}setName(e){this._name=e}setViewName(e){this._viewName=e}setComponentName(e){this._componentName=e}setUserName(e){this._userName=e}setShared(e){this._shared=e}setCode(e){this._code=e}setIsNewFilter(e){this._isNewFilter=e}static createInstance(){return new U}static createInstanceWithValues(e){const t=new U;return e.id!==void 0&&t.setId(e.id),e.companyId!==void 0&&t.setCompanyId(e.companyId),e.filter&&t.setFilter(e.filter),typeof e.name=="string"&&t.setName(e.name),typeof e.viewName=="string"&&t.setViewName(e.viewName),typeof e.componentName=="string"&&t.setComponentName(e.componentName),typeof e.userName=="string"&&t.setUserName(e.userName),typeof e.shared=="boolean"&&t.setShared(e.shared),typeof e.code=="string"&&t.setCode(e.code),typeof e.isNewFilter=="boolean"&&t.setIsNewFilter(e.isNewFilter),t}}function G({sortable:i=!0,quickFilter:e=!0,quickFilterSort:t=!1,...r}){return null}class z extends _.Component{static get componentName(){return"FilterFieldValue"}render(){return null}}function H({children:i}){return L("div",{children:i})}const ne=i=>{let e="",t=!1;return i.sort.sortFields.forEach(r=>{r.selected&&(t&&(e+=", "),e+=r.label+"("+(r.asc_desc==="asc"?"A":"D")+")",t=!0)}),e},M=i=>{let e=[];return O.Children.toArray(i).forEach(function(r){r&&r.type&&r.type.componentName==="QueryFields"&&r.props.children&&O.Children.toArray(r.props.children).forEach(function(o,a){let p=[];O.Children.toArray(o.props.children).forEach(function(F){p.push(L(z,{...F.props},"fld"+a))}),e.push(L(G,{...o.props,children:p},"fld"+a))})}),L(H,{children:e})},J=i=>{let e=[],t=M(i.children);return t&&O.Children.toArray(t).forEach(s=>{s.type&&s.type.componentName==="FilterFields"&&s.props.children&&O.Children.toArray(s.props.children).forEach(a=>{if(a.type&&a.type.componentName!=="FilterField")throw new ie("Somente filhos do tipo FilterField podem ser usados com FilterFields.");let p=[];O.Children.toArray(a.props.children).forEach(F=>{if(F.type&&F.type.componentName!=="FilterFieldValue")throw new ie("Somente filhos do tipo FilterFieldValue podem ser usados com FilterFields");p.push({label:F.props.label,value:F.props.value})}),e.push({name:a.props.name,label:a.props.label,dataType:a.props.dataType,operator:a.props.operator,quickFilter:a.props.quickFilter,quickFilterSort:a.props.quickFilterSort,sortable:a.props.sortable,listValues:p,searchComponent:a.props.searchComponent,searchField:a.props.searchField})})}),e},X=i=>{let e=[];return i&&i.forEach(t=>{t.quickFilter===!0&&e.push({name:t.name,label:t.label,dataType:"string",operator:"",quickFilter:!1,quickFilterSort:!1,sortable:!1,listValues:[],searchComponent:void 0,searchField:void 0})}),e},oe=i=>{let e=[];return i&&i.forEach((t,r)=>{t.quickFilterSort===!0&&e.push({name:t.name,label:t.label,selected:!1,order:r,asc_desc:"asc"})}),e},Y=i=>{let e="",t=!1;return i.forEach(function(r){r.quickFilterSort===!0&&(t&&(e+=","),e+=r.name,t=!0)}),e},le=i=>{let e="",t=!1;return i.forEach(r=>{r.selected&&t&&(e+=","),e+=r.name,t=!0}),e},qe=(i,e)=>{let t=[];return e&&(e.forEach(function(r,s){let o=!1,a="asc",p=s;i&&i.forEach(function(I){I.name===r.name&&(o=I.selected,a=I.asc_desc,p=I.order)}),t.push({name:r.name,selected:o,order:p,asc_desc:a||"asc",label:r.label})}),t=t.sort(function(r,s){return r.order-s.order})),t},Re=(i,e)=>{let t="",r=!1;return i&&i.filter&&(!i.filter.selectedFields||i.filter.selectedFields.length===0?e.forEach(s=>{s.quickFilter===!0&&(r&&(t=t+","),t+=s.name),r=!0}):i.filter.selectedFields.forEach(s=>{r&&(t+=","),t+=s.name,r=!0})),t},Xe=()=>({id:0,name:"",viewName:"",apiVersion:"",filter:{id:"root",selectedFields:[],quickFilterText:"",rules:[],condition:"",filterType:"normal",quickFilterFieldsText:""},sort:{quickFilterSort:"",sortFields:[],activeIndex:-1}}),Ye=[{name:"null",label:"Em branco",dataTypes:["string","number","date","date_time","time","boolean"]},{name:"notNull",label:"Preenchido",dataTypes:["string","number","date","date_time","time","boolean"]},{name:"contains",label:"Contém",dataTypes:["string"]},{name:"startsWith",label:"Iniciado com",dataTypes:["string"]},{name:"endsWith",label:"Terminado com",dataTypes:["string"]},{name:"=",label:"Igual",dataTypes:["string","number","date","date_time","time","boolean"]},{name:"!=",label:"Diferente",dataTypes:["string","number","date","date_time","time","boolean"]},{name:"<",label:"Menor",dataTypes:["string","number","date","date_time","time"]},{name:">",label:"Maior",dataTypes:["string","number","date","date_time","time"]},{name:"<=",label:"Menor igual",dataTypes:["string","number","date","date_time","time"]},{name:">=",label:"Maior igual",dataTypes:["string","number","date","date_time","time"]},{name:"between",label:"Entre",dataTypes:["string","number","date","date_time","time"]},{name:"inList",label:"Na lista",dataTypes:["string","number","date","time"]},{name:"notInList",label:"Fora da lista",dataTypes:["string","number","date","time"]}],de=(i,e)=>{let t=J(i),r={id:-1,name:"",viewName:"",apiVersion:"",filter:{id:"root",selectedFields:[],quickFilterText:"",quickFilterFieldsText:"",rules:[],condition:"",filterType:e},sort:{quickFilterSort:"",sortFields:[],activeIndex:-1}};return r.filter.selectedFields=X(t),r.filter.quickFilterFieldsText=Re(null,t),r.sort.sortFields=qe([],t),r.sort.quickFilterSort=Y(t),r};function ue({children:i}){return L("div",{children:i})}function pe({sortable:i=!0,quickFilter:e=!0,quickFilterSort:t=!1,operator:r="=",mask:s="",...o}){return null}class he extends _.Component{static get componentName(){return"QueryFieldValue"}render(){return null}}try{he.displayName="QueryFieldValue",he.__docgenInfo={description:"",displayName:"QueryFieldValue",props:{label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}}}}}catch{}try{pe.displayName="QueryField",pe.__docgenInfo={description:"",displayName:"QueryField",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},dataType:{defaultValue:null,description:"",name:"dataType",required:!0,type:{name:"enum",value:[{value:'"string"'},{value:'"number"'},{value:'"boolean"'},{value:'"time"'},{value:'"date"'},{value:'"date_time"'}]}},operator:{defaultValue:{value:"="},description:"",name:"operator",required:!1,type:{name:"enum",value:[{value:'"endsWith"'},{value:'"startsWith"'},{value:'"between"'},{value:'"contains"'},{value:'"="'},{value:'"!="'},{value:'"<"'},{value:'">"'},{value:'"<="'},{value:'">="'},{value:'"inList"'},{value:'"notInList"'}]}},sortable:{defaultValue:{value:"true"},description:"",name:"sortable",required:!1,type:{name:"boolean"}},quickFilter:{defaultValue:{value:"true"},description:"",name:"quickFilter",required:!1,type:{name:"boolean"}},quickFilterSort:{defaultValue:{value:"false"},description:"",name:"quickFilterSort",required:!1,type:{name:"boolean"}},searchComponent:{defaultValue:null,description:"",name:"searchComponent",required:!1,type:{name:"any"}},mask:{defaultValue:{value:""},description:"",name:"mask",required:!1,type:{name:"string | Function"}},filterWithMask:{defaultValue:null,description:"",name:"filterWithMask",required:!1,type:{name:"boolean"}}}}}catch{}try{ue.displayName="QueryFields",ue.__docgenInfo={description:"",displayName:"QueryFields",props:{}}}catch{}try{G.displayName="FilterField",G.__docgenInfo={description:"",displayName:"FilterField",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},dataType:{defaultValue:null,description:"",name:"dataType",required:!0,type:{name:"enum",value:[{value:'"string"'},{value:'"number"'},{value:'"boolean"'},{value:'"time"'},{value:'"date"'},{value:'"date_time"'}]}},sortable:{defaultValue:{value:"true"},description:"",name:"sortable",required:!1,type:{name:"boolean"}},quickFilter:{defaultValue:{value:"true"},description:"",name:"quickFilter",required:!1,type:{name:"boolean"}},quickFilterSort:{defaultValue:{value:"false"},description:"",name:"quickFilterSort",required:!1,type:{name:"boolean"}}}}}catch{}try{z.displayName="FilterFieldValue",z.__docgenInfo={description:"",displayName:"FilterFieldValue",props:{label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}}}}}catch{}try{H.displayName="FilterFields",H.__docgenInfo={description:"",displayName:"FilterFields",props:{}}}catch{}try{de.displayName="getDefaultFilter",de.__docgenInfo={description:"",displayName:"getDefaultFilter",props:{persistenceDelegator:{defaultValue:null,description:"",name:"persistenceDelegator",required:!0,type:{name:"ArchbaseQueryFilterDelegator"}},showClearButton:{defaultValue:null,description:"",name:"showClearButton",required:!1,type:{name:"boolean"}},showToggleButton:{defaultValue:null,description:"",name:"showToggleButton",required:!1,type:{name:"boolean"}},showPrintButton:{defaultValue:null,description:"",name:"showPrintButton",required:!1,type:{name:"boolean"}},showExportButton:{defaultValue:null,description:"",name:"showExportButton",required:!1,type:{name:"boolean"}},onClearFilter:{defaultValue:null,description:"",name:"onClearFilter",required:!1,type:{name:"(self: any) => {}"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"light"'},{value:'"filled"'},{value:'"outline"'},{value:'"default"'},{value:'"transparent"'},{value:'"white"'},{value:'"subtle"'},{value:'"gradient"'}]}},viewName:{defaultValue:null,description:"",name:"viewName",required:!0,type:{name:"string"}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},apiVersion:{defaultValue:null,description:"",name:"apiVersion",required:!0,type:{name:"string"}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"string"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"string"}},detailsWidth:{defaultValue:null,description:"",name:"detailsWidth",required:!1,type:{name:"number"}},detailsHeight:{defaultValue:null,description:"",name:"detailsHeight",required:!1,type:{name:"number"}},currentFilter:{defaultValue:null,description:"",name:"currentFilter",required:!1,type:{name:"ArchbaseQueryFilter"}},expandedFilter:{defaultValue:null,description:"",name:"expandedFilter",required:!1,type:{name:"boolean"}},activeFilterIndex:{defaultValue:null,description:"",name:"activeFilterIndex",required:!0,type:{name:"number"}},onToggleExpandedFilter:{defaultValue:null,description:"",name:"onToggleExpandedFilter",required:!1,type:{name:"(value: boolean) => void"}},onFilterChanged:{defaultValue:null,description:"",name:"onFilterChanged",required:!1,type:{name:"(currentFilter: ArchbaseQueryFilter, index: number, callback?: () => void) => void"}},onSearchByFilter:{defaultValue:null,description:"",name:"onSearchByFilter",required:!1,type:{name:"() => void"}},onSelectedFilter:{defaultValue:null,description:"",name:"onSelectedFilter",required:!1,type:{name:"(filter: ArchbaseQueryFilter, index: number) => void"}},userName:{defaultValue:null,description:"",name:"userName",required:!1,type:{name:"any"}},onPrint:{defaultValue:null,description:"",name:"onPrint",required:!1,type:{name:"() => void"}},onExport:{defaultValue:null,description:"",name:"onExport",required:!1,type:{name:"() => void"}}}}}catch{}try{Y.displayName="getQuickFilterSort",Y.__docgenInfo={description:"",displayName:"getQuickFilterSort",props:{}}}catch{}try{X.displayName="getQuickFields",X.__docgenInfo={description:"",displayName:"getQuickFields",props:{}}}catch{}try{J.displayName="getFields",J.__docgenInfo={description:"",displayName:"getFields",props:{}}}catch{}try{oe.displayName="getQuickFieldsSort",oe.__docgenInfo={description:"",displayName:"getQuickFieldsSort",props:{}}}catch{}try{le.displayName="getQuickFilterSortBySelectedFields",le.__docgenInfo={description:"",displayName:"getQuickFilterSortBySelectedFields",props:{}}}catch{}try{M.displayName="convertQueryFields",M.__docgenInfo={description:"",displayName:"convertQueryFields",props:{}}}catch{}try{ne.displayName="getSortString",ne.__docgenInfo={description:"",displayName:"getSortString",props:{sort:{defaultValue:null,description:"",name:"sort",required:!0,type:{name:"{ sortFields: any[]; }"}}}}}catch{}class Ae extends we{constructor(e,t,r,s){super(t,r,s),this.service=e}async save(e){if(this.validateDataSourceActive("save"),!this.inserting&&!this.editing){const t=v.t("archbase:saveRecordIsNotAllowed",{dataSourceName:this.name});throw this.publishEventError(t,{}),new y(t)}if(!this.currentRecord){const t=v.t("archbase:noRecordToSave",{dataSourceName:this.name});throw this.publishEventError(t,{}),new y(t)}if(this.emitter.emit("beforeSave",this.currentRecord),this.emit({type:S.beforeSave,record:this.currentRecord,index:this.getCurrentIndex()}),this.validator){const t=this.validator.validateEntity(this.currentRecord);if(t&&t.length>0)if(this.publishEventErrors(t),t[0].fieldName){const r=v.t("archbase:errorSavingRecord",{dataSourceName:this.label});throw new y(r)}else throw new y(t[0].errorMessage)}try{let t=-1;this.records.forEach((r,s)=>{const o=this.getIdentity?this.getIdentity(r):r.id,a=this.getIdentity?this.getIdentity(this.currentRecord):this.currentRecord.id;(r===this.currentRecord||o!==void 0&&o===a)&&(t=s)}),this.currentRecord=await this.service.save(this.currentRecord),this.editing&&(this.filteredRecords[this.getCurrentIndex()]=this.currentRecord),t>=0?this.records[t]=this.currentRecord:this.records.push(this.currentRecord),this.editing=!1,this.inserting=!1,this.lastDataChangedAt=new Date().getTime(),this.emitter.emit("afterSave",this.currentRecord),this.emit({type:S.afterSave,record:this.currentRecord,index:this.getCurrentIndex()}),e&&e()}catch(t){t.response&&t.response.data&&t.response.data.apierror&&t.response.data.apierror.subErrors&&t.response.data.apierror.subErrors.forEach(s=>{s.field&&(this.emitter.emit("onFieldError",s.field,s.message),this.emit({type:S.onFieldError,fieldName:s.field,error:s.message,originalError:s.message}))});const r=b(t);throw this.emitter.emit("onError",r,t),this.emit({type:S.onError,error:r,originalError:t}),e&&e(r),new y(r)}return this.currentRecord}async remove(e){if(this.validateDataSourceActive("remove"),this.inserting||this.editing){const t=v.t("archbase:removingRecordIsNotAllowed",{dataSourceName:this.name});throw this.publishEventError(t,{}),new y(t)}if(this.isEmpty()||!this.currentRecord){const t=v.t("archbase:noRecordsToEdit",{dataSourceName:this.name});throw this.publishEventError(t,{}),new y(t)}if(this.isBOF()){const t=v.t("archbase:BOFDataSource",{dataSourceName:this.name});throw this.publishEventError(t,{}),new y(t)}if(this.isEOF()){const t=v.t("archbase:EOFDataSource",{dataSourceName:this.name});throw this.publishEventError(t,{}),new y(t)}this.emitter.emit("beforeRemove",this.currentRecord,this.currentRecordIndex),this.emit({type:S.beforeRemove,record:this.currentRecord,index:this.getCurrentIndex()});try{await this.service.delete(this.service.getId(this.currentRecord));let t=-1;const r=this.currentRecord,s=this.currentRecordIndex;return this.records.forEach((o,a)=>{this.currentRecord===o&&(t=a)}),t>=0&&this.records.splice(t,1),this.records!==this.filteredRecords&&this.filteredRecords.splice(this.getCurrentIndex(),1),this.grandTotalRecords--,this.filteredRecords.length===0?(this.currentRecord=void 0,this.currentRecordIndex=-1):(this.currentRecordIndex>this.filteredRecords.length-1&&this.currentRecordIndex--,this.currentRecord=this.filteredRecords[this.currentRecordIndex]),this.editing=!1,this.inserting=!1,this.emitter.emit("afterScroll"),this.emit({type:S.afterScroll}),this.emitter.emit("afterRemove",r,s),this.emit({type:S.afterRemove,record:r,index:s}),this.lastDataBrowsingOn=new Date().getTime(),this.lastDataChangedAt=new Date().getTime(),e&&e(),r}catch(t){const r=b(t);throw this.emitter.emit("onError",r,t),this.emit({type:S.onError,error:r,originalError:t}),e&&e(r),new y(r)}}applyRemoteFilter(e,t,r){return e&&e.filter.filterType===De&&e.filter.quickFilterText&&e.filter.quickFilterText!==""?this.getDataWithQuickFilter(e,t):e&&(e.filter.filterType===Oe||e.filter.filterType===Le)?this.getDataWithFilter(e,t):this.getDataWithoutFilter(t)}async getDataWithFilter(e,t){const r=new be;r.buildFrom(e.filter,e.sort);const s=r.toJSON();let o;return s?o=await this.service.findAllWithFilter(r.toJSON(),t,this.getPageSize()):o=this.getDataWithoutFilter(t),o}getDataWithoutFilter(e){let t;return this.defaultSortFields.length>0?t=this.service.findAllWithSort(e,this.getPageSize(),this.defaultSortFields):t=this.service.findAll(e,this.getPageSize()),t}getDataWithQuickFilter(e,t){return this.service.findAllMultipleFields(e.filter.quickFilterText,e.filter.quickFilterFieldsText,t,this.getPageSize(),this.getSortFields(e))}getSortFields(e){return e&&e.sort?e.sort.quickFilterSort:this.defaultSortFields}}function Ce(i){return i.totalElements||i.totalElements===0?i.totalElements:i.page.totalElements}function Ve(i){return i.totalPages||i.totalPages===0?i.totalPages:i.page.totalPages}function We(i){return i.pageable?i.pageable.pageNumber:i.page.number}function Ke(i){const{name:e,label:t,service:r,filter:s,sort:o,transformData:a,onLoadComplete:p,onDestroy:I,filterData:F,findAll:K,findAllWithSort:j,findAllWithFilter:Z,findAllWithFilterAndSort:$,initialDataSource:D,pageSize:Q=50,currentPage:ee=0,loadOnStart:fe=!0,store:N,id:me,validator:te}=i,R=_.useRef(!1),Ee=()=>!!(N&&N.existsValue(e)||D),ge=()=>N&&N.existsValue(e)?N.getValue(e):D||new Ae(r,e,{records:[],grandTotalRecords:0,currentPage:ee,totalPages:0,pageSize:Q,validator:te},t),Ne=()=>N&&N.existsValue(e)?N.getValue(e).getCurrentPage():D?D.getCurrentPage():0,[u,T]=_.useState({dataSource:ge(),isLoading:!1,isError:!1,error:"",name:e,label:t,filter:s,sort:o,id:me,currentPage:Ne(),pageSize:Q,loadDataCount:Ee()?1:0}),P=async(m,l,h,E,c,k,Se,_e,Te)=>{let f;if(k){const w=await r.findOne(k);w?f=se.createFromValues([w],1,0,0,0):f=se.createFromValues([],0,0,0,0)}else $&&E&&c&&c.length>0?f=await $(E,l,h,c):Z&&E?f=await Z(E,l,h):j&&c&&c.length>0?f=await j(l,h,c):K?f=await K(l,h):E&&c&&c.length>0?f=await r.findAllWithFilterAndSort(E,l,h,c):E?f=await r.findAllWithFilter(E,l,h):c&&c.length>0?f=await r.findAllWithSort(l,h,c):f=await r.findAll(l,h);F&&(f=F(f)),a&&(f=a(f)),T(w=>{const re={records:f.content,grandTotalRecords:Ce(f),totalPages:Ve(f),currentPage:We(f),pageSize:h,filter:E,sort:c,originFilter:Se,originGlobalFilter:Te,originSort:_e,validator:te};return w.dataSource.isActive()?w.dataSource.setData(re):w.dataSource.open(re),{...w,currentPage:l,pageSize:h,filter:E,sort:c,id:k,isLoading:!1,isError:!1,error:"",loadDataCount:w.loadDataCount+1}}),N&&N.setValue(e,u.dataSource)};_.useEffect(()=>{p&&u.loadDataCount>0&&p(u.dataSource)},[u.loadDataCount]);const A=_.useCallback(m=>{if(m.type===S.refreshData){const l=m.options;try{T(h=>({...h,isLoading:!0,filter:l.filter,sort:l.sort,currentPage:l.currentPage,id:l.id})),P(u.name,l.currentPage,l.pageSize,l.filter,l.sort,l.id,l.originFilter,l.originSort,l.originGlobalFilter).catch(h=>{const E=b(h);T(c=>({...c,isError:!0,isLoading:!1,error:E})),i.onError&&i.onError(E,h)})}catch(h){const E=b(h);T(c=>({...c,isError:!0,isLoading:!1,error:E})),i.onError&&i.onError(E,h)}}},[P,u.name,i.onError]),ye=_.useCallback(m=>{R.current||(m.addListener(A),R.current=!0)},[A]),Ie=_.useCallback(m=>{R.current&&(m.removeListener(A),R.current=!1)},[A]);_.useEffect(()=>{try{return ye(u.dataSource),fe&&u.loadDataCount===0?(T(m=>({...m,isLoading:!0})),P(u.name,ee,Q,u.filter,u.sort,u.id).catch(m=>{const l=b(m);T(h=>({...h,isError:!0,isLoading:!1,error:l})),i.onError&&i.onError(l,m)})):p&&p(u.dataSource),()=>{I&&(Ie(u.dataSource),I(u.dataSource))}}catch(m){const l=b(m);T(h=>({...h,isError:!0,isLoading:!1,error:l})),i.onError&&i.onError(l,m)}},[u.name,u.sort,u.filter,u.id,u.currentPage,u.pageSize]);const Fe=()=>{T(m=>({...m,isError:!1,isLoading:!1,error:""}))};return{isLoading:u.isLoading,isError:u.isError,error:u.error,dataSource:u.dataSource,clearError:Fe}}export{Le as A,He as N,Me as O,ue as Q,pe as a,he as b,Je as c,ne as d,J as e,ze as f,Xe as g,Oe as h,Ye as i,X as j,M as k,oe as l,de as m,De as n,Re as o,U as p,Ke as u};
