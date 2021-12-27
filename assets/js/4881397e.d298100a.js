"use strict";(self.webpackChunkapiexception=self.webpackChunkapiexception||[]).push([[170],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return m}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=o.createContext({}),p=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=p(e.components);return o.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=r,h=d["".concat(c,".").concat(m)]||d[m]||u[m]||a;return n?o.createElement(h,i(i({ref:t},l),{},{components:n})):o.createElement(h,i({ref:t},l))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var p=2;p<a;p++)i[p]=n[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7157:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return l},default:function(){return d}});var o=n(3117),r=n(102),a=(n(7294),n(3905)),i=["components"],s={title:"Custom exceptions"},c=void 0,p={unversionedId:"gettingstarted/usage/custom",id:"gettingstarted/usage/custom",title:"Custom exceptions",description:"When using the decorator with custom exceptions, this decorator gets much more useful than just using the decorator with NestJS built-in exceptions.",source:"@site/docs/gettingstarted/usage/custom.md",sourceDirName:"gettingstarted/usage",slug:"/gettingstarted/usage/custom",permalink:"/nestjs-swagger-api-exception-decorator/gettingstarted/usage/custom",editUrl:"https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/edit/documentation/docs/gettingstarted/usage/custom.md",tags:[],version:"current",frontMatter:{title:"Custom exceptions"},sidebar:"docs",previous:{title:"Built-in exceptions",permalink:"/nestjs-swagger-api-exception-decorator/gettingstarted/usage/simple"},next:{title:"Templated exceptions",permalink:"/nestjs-swagger-api-exception-decorator/gettingstarted/usage/templated"}},l=[{value:"Why custom exceptions?",id:"why-custom-exceptions",children:[],level:2},{value:"Route methods",id:"route-methods",children:[{value:"Overwrite the description",id:"overwrite-the-description",children:[],level:3},{value:"Pass exceptions as an array",id:"pass-exceptions-as-an-array",children:[],level:3}],level:2},{value:"Class wide",id:"class-wide",children:[],level:2},{value:"Custom exceptions with arguments",id:"custom-exceptions-with-arguments",children:[],level:2}],u={toc:l};function d(e){var t=e.components,n=(0,r.Z)(e,i);return(0,a.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"When using the decorator with custom exceptions, this decorator gets much more useful than just using the decorator with NestJS built-in exceptions."),(0,a.kt)("h2",{id:"why-custom-exceptions"},"Why custom exceptions?"),(0,a.kt)("p",null,"Assuming you're already using custom exceptions in your NestJS backend. For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"// bad-request-exceptions.ts\n\nimport { BadRequestException } from '@nestjs/common';\n\nexport class PasswordInvalidException extends BadRequestException {\n  constructor() {\n    super('The password was invalid');\n  }\n}\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"// unauthorized-exceptions.ts\n\nimport { UnauthorizedException } from '@nestjs/common';\n\nexport class UserNotAuthorizedException extends UnauthorizedException {\n  constructor() {\n    super('The user is not authorized');\n  }\n}\n")),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Remember that all NestJS exceptions extend ",(0,a.kt)("inlineCode",{parentName:"em"},"HttpException")," which contain a description, error and the HTTP status code.")),(0,a.kt)("p",null,"The advantages of using custom exceptions are:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Re-use the custom exception in multiple services and controllers"),(0,a.kt)("li",{parentName:"ul"},"The description needs to be written once"),(0,a.kt)("li",{parentName:"ul"},"Just ",(0,a.kt)("inlineCode",{parentName:"li"},"throw new UserNotAuthorizedException();"),". There is no need to ",(0,a.kt)("inlineCode",{parentName:"li"},"throw new UnauthorizedException('The user is not authorized');")," over and over again",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Much more convenient when using auto-completion / IntelliSense"))),(0,a.kt)("li",{parentName:"ul"},"Compatible with ",(0,a.kt)("inlineCode",{parentName:"li"},"@ApiException")," decorator")),(0,a.kt)("h2",{id:"route-methods"},"Route methods"),(0,a.kt)("p",null,"Simply import the decorator in your controller where you want to document the API exceptions:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';\n")),(0,a.kt)("p",null,"Then start decorating the controller routes where the API exceptions should be shown in the Swagger-UI. For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';\n\nimport { UserNotAuthorizedException } from './unauthorized-exceptions';\nimport { PasswordInvalidException } from './bad-request-exceptions';\n\nexport class UserController {\n  @ApiOperation({ summary: 'Changes the users password' })\n  @ApiException(() => [PasswordInvalidException, UserNotAuthorizedException])\n  @Patch('/password')\n  async changeUserPassword(@Res() res: Response): Promise<void> {\n    return res.sendStatus(HttpStatus.OK);\n  }\n}\n")),(0,a.kt)("p",null,"The decorator then takes the exception descriptions, errors and status codes and passes them to Swagger-UI. No need to pass an object containing a description here!"),(0,a.kt)("h3",{id:"overwrite-the-description"},"Overwrite the description"),(0,a.kt)("p",null,"If you pass an object containing the description, the description will be overwritten by the description you defined."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"@ApiException(() => PasswordInvalidException, { description: 'Any other description' })\n")),(0,a.kt)("h3",{id:"pass-exceptions-as-an-array"},"Pass exceptions as an array"),(0,a.kt)("p",null,"You can also pass an array of exceptions to the decorator. For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"// bad-request-exceptions.ts\n\nimport { BadRequestException } from '@nestjs/common';\n\nexport class PasswordInvalidException extends BadRequestException {\n  constructor() {\n    super('The password was invalid');\n  }\n}\n\nexport class PasswordNotMatchingRequirementsException extends BadRequestException {\n  constructor() {\n    super('The password does not match the requirements');\n  }\n}\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"@ApiException(() => [PasswordInvalidException, PasswordNotMatchingRequirementsException])\n")),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"This allows to pass multiple exceptions with different status codes. The decorator determines which HTTP status code is specified in the exceptions and attaches the exceptions automatically to the correct example values."))),(0,a.kt)("h2",{id:"class-wide"},"Class wide"),(0,a.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Decorators at class level will ",(0,a.kt)("strong",{parentName:"p"},"only")," be applied to controller routes which are decorated by ",(0,a.kt)("inlineCode",{parentName:"p"},"@ApiOperation")," decorator!"))),(0,a.kt)("h2",{id:"custom-exceptions-with-arguments"},"Custom exceptions with arguments"),(0,a.kt)("p",null,"If using custom exceptions with arguments, the decorator can't instantiate the exceptions itself. Therefore you've to instantiate the exceptions yourself. This allows, to provide an example for the exception in Swagger-UI."),(0,a.kt)("p",null,"For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"export class UserNotFoundException extends NotFoundException {\n  constructor(private email: string) {\n    super(`${email} not found`);\n  }\n}\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"@ApiException(() => new UserNotFoundException('test@email.com'))\n")))}d.isMDXComponent=!0}}]);