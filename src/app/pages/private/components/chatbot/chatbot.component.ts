import { Component, OnInit } from '@angular/core';
import { chatinterface } from 'src/app/core/interfaces/private.interfaces';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  public list_chat: chatinterface[] = [
    {
      class_style: 'message received',
      user: 'Chat Bot',
      message: 'Hola, ¿cómo estás?, en que te puedo ayudar?',
    },
  ];

  ngOnInit(): void {}
  mensaje: string = ''; // Variable para almacenar el mensaje

  enviarMensaje() {
    const data: chatinterface = {
      class_style: 'message sent',
      user: 'Usuario',
      message: this.mensaje,
    };
    this.mensaje = '';
    this.list_chat.push(data);
  }
}
