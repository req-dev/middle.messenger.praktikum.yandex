// language=hbs
import './Input.pcss';

const Input = `<div class="input">
    <label for="{{id}}" class="input__hint">{{hint}}</label>
    <input type="{{type}}"
           placeholder="{{placeholder}}"
           name="{{name}}"
           class="input__input{{#if errorText}} input__input_error{{/if}}"
           id="{{id}}">
    {{#if errorText}}
        <label class="input__error">{{errorText}}</label>
    {{/if}}
</div>`;
export default Input;
