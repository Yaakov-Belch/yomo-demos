import React from 'react';
import {yomoApp, yomoView} from 'yomo/v1';
import {survey, Survey, Page, Q, Qa, Qs, Qc, O}
  from './Query/query.js';

const Survey123=yomoView(({yomo})=>{
  const {a}=yomo.state();
  return <Survey>
    <Page>
      <Qc id='what-dev'>
        <Q>1. Which of the following best describes you?</Q>
        <O info='fullstack-owner'>
          I am responsible for a <b>complete application</b>.
          Back-end and front-end. Scalability and
          fault-tolerance on the back-end mean a lot to me.
          Real-time messaging with websockets is a must.
          Simplicity and consistency of the whole
          application saves a lot of development time.
          Supporting web and native clients with the same
          technology sounds great --- though because of
          different user expectations, parts of the
          UI will be device specific.
        </O>
        <O info='backend-dev'>
          I have <b>back-end</b> experience.
          When I need to work with the front-end, I like to
          use technologies that make sense on the server:
          node.js, npm.
        </O>
        <O info='frontend-dev'>
          My background is the <b>front-end</b>.
          I like to learn something new --- but something good!
          I am more interested in cutting complexity from
          my application than in writing back-end code.
        </O>
        <O info='other-dev'>
          I am different! (Please be specific):
            <Qa id='other-dev-data'/>
        </O>
      </Qc>
    </Page><Page>
      <Qc id='team-size'>
        <Q>2. How big is your dev team right now?</Q>
        <O info='single-team'>
          I am working on my own.
        </O>
        <O info='small-team'>
          1-3: We know each other well and naturally
          share our work.
        </O>
        <O info='medium-team'>
          1-20: I personally know all members of our team
          and we have well-defined processes (such as Scrum)
          to manage work progress.
        </O>
        <O info='other-team'>
          This is real life (please be specific):
            <Qa id='other-team-data'/>
        </O>
      </Qc>
    </Page><Page>
      <Qa id='smoq-logic'>
        <Q>
          3. What kind of business logic creates the most
          problems?
        </Q>
        With the technologies that you know well --- which
        application logic features just don't match well with
        the technology paradigms?   What kind of logic produces
        the most dependencies, bugs, boiler plate or a need to
        refactor frequently?
        <br/>
        Pick one example and provide as much detail as possible.
      </Qa>
    </Page><Page>
      <Qa id='worst-bug'>
        <Q>4. What is the worst kind of bug?</Q>
        When you think about the worst bug that you have
        encountered --- or about the worst case that you want
        to avoid.  What comes to mind?  Race conditions? Data
        corruption?  Security breaches?  Slow response times?
        Pick the one worst problem --- and give details how
        this affects your business bottom line, reputation or
        progress.
      </Qa>
    </Page><Page>
      <Qc id='fp'>
        <Q>
          5. What's your gut reaction to functional programming?
        </Q>
        <O info='fp-confusing'>
          Functional programming is academic and confusing.
        </O>
        <O info='fp-interesting'>
          It got a lot of good press recently.  I am interested,
          but I'd like to keep at least one foot in 'known
          territory' for the time being.  I can't see myself
          to stop assigning values to variables anytime soon.
        </O>
        <O info='fp-helps'>
          This is my secret: Functional programming just makes
          me happy when I work.  I don't care so much about
          opinions --- but since I use FP, I was able to let
          go of a lot of mess, confusion and despair when
          programming.  Of course, when we think about
          programming, we like to recall the moments of pride,
          adding new features and being in control.  But without
          functional programming, the 'dark side' of complexity
          catches you quite regularly.
        </O>
        <O info='fp-pure'>
          Pure please.
        </O>
        <O info='other-fp'>
          :(please be specific):
            <Qa id='other-fp-data'/>
        </O>
      </Qc>
    </Page><Page>
      <Q>6. Follow-up </Q>
      Lastly, I may follow-up with a few people to learn a
      little more about your situation... If you'd be open to
      chatting for a few minutes, on the condition I PROMISE
      not to try to sell you something --- please leave your
      name and e-mail below. (Also, if you'd like to get a
      shout-out when I write about your topic --- please leave
      your contact information below as well...) Thanks so much!


      <Q> Your name: </Q> <Qs id='name'/>
      <Q> Your e-mail: </Q> <Qs id='e-mail'/>
      <Q> Your phone (optional): </Q> <Qs id='phone'/>
    </Page><Page>
      Thank you so much for sharing your opinion!
    </Page>
  </Survey>;
});

yomoApp({reducer:survey, View:Survey123});
