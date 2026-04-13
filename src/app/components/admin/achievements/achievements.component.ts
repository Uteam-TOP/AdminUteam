import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {ExcelReaderComponent} from "../excel-reader/excel-reader.component";
import {NgIf} from "@angular/common";
import {OrderListModule} from "primeng/orderlist";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PrimeTemplate} from "primeng/api";
import {TagFormComponent} from "../tag-form/tag-form.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {AchievementsService} from "../services/achievements.service";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {mergeMap} from "rxjs";

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    Button,
    ExcelReaderComponent,
    NgIf,
    OrderListModule,
    OverlayPanelModule,
    PrimeTemplate,
    TagFormComponent,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.css'
})
export class AchievementsComponent implements OnInit {

  visibleForm: boolean = false;
  private achievementsService = inject(AchievementsService);
  private fb = inject(FormBuilder);

  achievements = signal([]);

  achievementForm!: FormGroup;

  ngOnInit() {
    this.achievementForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      image: [],
    })

    this.updateAchievements();
  }

  updateAchievements(): void {
    this.achievementsService.getAchievements().subscribe(result => {
      this.achievements.set(result)
    })
  }

  addAchievement() {
    this.visibleForm = true;
  }

  resetForm() {

  }

  onSubmit() {
    console.log(this.achievementForm.value.image);
    const formData = new FormData();
    formData.append('file', this.achievementForm.value.image, this.achievementForm.value.image.name);

    if (this.achievementForm.valid) {
      this.achievementsService.addImage(formData).pipe(
        mergeMap(data => {
          const addData = {
            title: this.achievementForm.value.title,
            image: data.message
          }
          return this.achievementsService.addAchievement(addData)
        })
      ).subscribe(result => {
        this.updateAchievements();
        this.achievementForm.reset();
      })
    }
  }

  onImageChange(event: Event, target?: 'background' | 'logo'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

      if (!allowedTypes.includes(file.type)) {
        console.error('Unsupported file type:', file.type);
        alert('Please upload a PNG or JPEG image.');
        return;
      }

      if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
          const binaryData: ArrayBuffer = reader.result as ArrayBuffer;
          console.log('Бинарные данные:', new Uint8Array(binaryData));
        };
        this.achievementForm.value.image = file;
      }

      const objectUrl = URL.createObjectURL(file);



      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    }
  }

  onRowDelete(id: number) {
    this.achievementsService.deleteImage(id).subscribe(result => this.updateAchievements())
  }
}
