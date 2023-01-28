import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee/Employee';
import {
  addDoc,
  collection,
  Firestore,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  editEmployeeForm!: FormGroup;
  employeeList!: Observable<any>;
  closeResult = '';
  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.onShow();
    this.route.queryParamMap.subscribe((param: any) => {
      console.log(param['params']);
      const data = param['params'];
      this.editEmployeeForm = this.fb.group({
        name: data.name,
        email: data.email,
        age: data.age,
      });
    });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onShow() {
    const employees = collection(this.firestore, 'employees');
    collectionData(employees).subscribe((data: any) => {
      console.log(data.length);
    });

    this.employeeList = collectionData(employees, { idField: 'id' });
  }

  onEdit(id: string) {
    const employees = doc(this.firestore, 'employees', id);
    const updatedValues = {
      name: this.editEmployeeForm.get('name')?.value,
      email: this.editEmployeeForm.get('email')?.value,
      age: this.editEmployeeForm.get('age')?.value,
    };
    updateDoc(employees, updatedValues)
      .then(() => {
        console.log('data updated');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onDelete(id: string) {
    const employees = doc(this.firestore, 'employees', id);
    deleteDoc(employees)
      .then(() => {
        console.log('data deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
