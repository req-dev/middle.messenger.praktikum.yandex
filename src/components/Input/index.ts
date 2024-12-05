//language=hbs
import './style.pcss';
const Input = `<div class="input">
    <label class="input__hint">{{hint}}</label>
    <input type="{{type}}" placeholder="{{placeholder}}" name="{{name}}" class="input__input">
    <label class="input__error">{{errorText}}</label>
</div>`;
export default Input;