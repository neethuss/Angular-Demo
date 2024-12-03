import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn:'root'
})

export class ValidationService{
  validateName(control:AbstractControl):ValidationErrors | null{
    const value = control.value
    const regex = /^[A-Za-z]*$/;
    const hasUpperCase = /[A-Z]/
    if(value){
      if(value.length < 4){
        return {nameInValid:'Atleast 4 characters'}
      }
      if(!hasUpperCase.test(value)){
        return{nameInValid:'Atleast one upper case'}
      }
      if(!regex.test(value)){
        return {nameInValid:'only contains letter'}
      }
    }else{
      return{nameInValid:'Fill this field'}
    }
    return null
  }


  validateEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Email regex
    if (value )
      if(!regex.test(value)) {
      return { emailInvalid: 'Invalid email format' };
    }else{
      return{emailInvalid:'Fill this field'}

    }
    return null;
  }

  validatePassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if(value){

    }else{
      return{passwordInvalid:'Fill this field'}
    };
    return null;
  }

}