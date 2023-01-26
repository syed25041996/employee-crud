import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee/Employee';
import { addDoc, collection, Firestore, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import $ from 'jquery'


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  employeeList !: Observable<any>;

  constructor(private route: ActivatedRoute,private firestore : Firestore) {}

  ngOnInit(): void {
    //modal
    $('#exampleModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')
    })

    this.onShow()
  }

  onShow(){
    const employees = collection(this.firestore, 'employees')
    collectionData(employees).subscribe((data : any) => {
      console.log(data.length)
    })

    this.employeeList = collectionData(employees, {idField: 'id'})
  }

  onEdit(id : string){
    const employees = doc(this.firestore, 'employees', id)
    const updatedName = {
      name : 'Bob'
    }
    updateDoc(employees,updatedName).then(() => {
      console.log("data updated")
    }).catch((err) => {
      console.log(err)
    })
  }

  onDelete(id : string){
    const employees = doc(this.firestore, 'employees', id)
    deleteDoc(employees).then(() => {
      alert("data deleted")
    }).catch((err) => {
      console.log(err)
    })
  }
}
