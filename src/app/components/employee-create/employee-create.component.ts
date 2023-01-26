import { Component, OnInit } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {
  
  employeeForm !: FormGroup

  constructor(private fb : FormBuilder, private router : Router, private firestore : Firestore){}
  
  ngOnInit(): void {

    this.employeeForm = this.fb.group({
      name : [''],
      email : [''],
      age : ['']
    })

  }

  onSubmit(){
    //Firestore
    
    const employees = collection(this.firestore, 'employees')
    addDoc(employees, this.employeeForm.value).then((res) => {
      console.log(res)
      alert("Data Saved sucessfully")
    }).catch((err) =>{
      console.log(err)
    })

    console.log(this.employeeForm.value)
    this.router.navigate(['/employee-list'], {queryParams:this.employeeForm.value})
  }


}
