import socket from '../../../socket';
import redraw from '../../../utils/redraw';
import { handleXhrError } from '../../../utils';
import * as xhr from './../inboxXhr';
import * as helper from '../../helper';
import * as m from 'mithril';
import { InboxData, Thread } from './../interfaces';
import router from '../../../router';

interface ThreadAttrs {
  id: string;
}

interface InputTag {
  value: string;
}

export default function oninit(vnode: Mithril.Vnode<ThreadAttrs>): void {
  helper.analyticsTrackView('Inbox');

  socket.createDefault();

  const id = m.prop<string>(vnode.attrs.id);
  const thread = m.prop<Array<Thread>>();

  xhr.thread(id())
  .then(data => {
    console.log(data);
    thread(data);
    redraw();
  })
  .catch(handleXhrError);

  vnode.state = {
    id,
    thread,
    send
  };
}

function send(form: Array<InputTag>) {
  const id = form[0].value;
  const response = form[1].value;
  if(!response || response === '') return;

  xhr.respond(id, response)
  .then(data => {
    console.log(data);
    if(data.ok) {
      router.set('/inbox/' + id)
    }
    else {
      redraw();
    }
  })
  .catch(handleXhrError);
}
