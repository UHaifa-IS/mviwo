import { PipesModule } from './../../pipes/pipes.module';
import { MviwoListSelectModule } from './../material/mviwo-list-select/mviwo-list-select.module';
// import { routing } from './metric-group.routing';
import { NgModule } from '@angular/core';
import { MatIconModule, MatButtonModule, MatMenuModule,
	MatTableModule, MatCheckboxModule, MatSortModule,
	MatFormFieldModule, MatInputModule, MatPaginatorModule,
	MatTooltipModule, MatDialogModule, MatTabsModule,
	MatButtonToggleModule, MatSliderModule, MatSlideToggleModule,
	MatSelectModule, MatListModule, MatDatepickerModule,
	MatNativeDateModule,
	MatRadioModule} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionGalleryComponent } from './session-gallery/session-gallery.component';
import { SessionFormComponent } from './session-form/session-form.component';

@NgModule({
	imports: [
		// routing
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		MatTableModule,
		MatCheckboxModule,
		MatSortModule,
		MatFormFieldModule,
		MatInputModule,
		MatPaginatorModule,
		MatTooltipModule,
		MatDialogModule,
		MatTabsModule,
		MatButtonToggleModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSelectModule,
		MatListModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatRadioModule,

		MviwoListSelectModule,

		// PipesModule,
	],
	declarations: [
		SessionGalleryComponent,
		SessionFormComponent,
	],
	exports: [
		SessionGalleryComponent,
	],
	providers: [],
	entryComponents: [
		SessionFormComponent,
	]
})
export class SessionModule {}
