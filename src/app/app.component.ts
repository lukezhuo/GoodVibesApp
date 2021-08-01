import { Component, OnInit } from '@angular/core';
import { NoteService } from './note.service';
import { Note } from './note';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public notes!: Note[];
  public editNote!: Note | null;
  public deleteNote!: Note;

  constructor(private noteService : NoteService){}
  ngOnInit(){
    this.getNotes()
  }
  public getNotes() : void{
    this.noteService.getNotes().subscribe(
      (response: Note[]) => {
        this.notes = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public searchNotes(key: String): void {
    const results: Note[] = [];
    for (const note of this.notes){
      if (note.body.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(note);
      }
      else if(note.name.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(note);
      }
    }
    this.notes = results;
    if (results.length === 0 || !key){
      this.getNotes();
    }
  }


  public onOpenModal(note: Note | null, mode: String): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addNoteModal');
    }
    if (mode === 'edit'){
      this.editNote = note;
      button.setAttribute('data-target', '#updateNoteModal');
    }
    if (mode === 'delete'){
      if (note === null){

      }
      else{
        this.deleteNote = note;
      }
      button.setAttribute('data-target', '#deleteNoteModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddNote(addForm: NgForm): void{
    document.getElementById('add-element-form')?.click();
    this.noteService.addNote(addForm.value).subscribe(
      (response: Note) => {
        console.log(response);
        this.getNotes();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  public onUpdateNote(note: Note): void{
    document.getElementById('add-element-form')?.click();
    this.noteService.updateNote(note).subscribe(
      (response: Note) => {
        console.log(response);
        this.getNotes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  public onDeleteNote(noteId: number): void{
    this.noteService.deleteNote(noteId).subscribe(
      (response: void) => {
        console.log(response);
        this.getNotes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
