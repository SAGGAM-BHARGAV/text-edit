const socket = io();
let editor;
 
require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',  
    language: 'javascript',  
    theme: 'vs-dark'  
  });

  socket.on('content_update', (content) => {
    editor.setValue(content);
  });
 
  editor.onDidChangeModelContent((event) => {
    const content = editor.getValue();
    socket.emit('content_update', content);
  });
 
  socket.on('cursor_update', (cursorData) => {
    editor.revealPosition(cursorData);
  });
 
  editor.onDidChangeCursorPosition((event) => {
    const cursor = editor.getPosition();
    socket.emit('cursor_update', cursor);
  });
});
 
socket.on('user_list', (users) => {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach((user) => {
    const listItem = document.createElement('li');
    listItem.textContent = user.username;
    userList.appendChild(listItem);
  });
});