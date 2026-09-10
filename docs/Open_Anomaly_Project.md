# Open Anomaly Project

## Mission, Principles, Boundaries, and Public Vision

> **Make unusual observations easier to capture, harder to fake, easier to correlate, easier to investigate, and harder to lose.**

The **Open Anomaly Project (OAP)** is a free, open-source citizen-science project built on top of the spatial foundation provided by God's Eye View.

It exists to help ordinary people, researchers, developers, and optional AI agents collaboratively document and investigate unusual events occurring in the real world.

Those events may include strange lights in the sky, unusual aircraft, meteors, atmospheric effects, satellite phenomena, rocket events, unexplained sounds, geological events, maritime anomalies, alleged UAPs, alleged "portals," or things we have not thought to classify yet.

OAP does not exist to prove that extraordinary phenomena are real.

It also does not exist to prove that they are not.

Its job is simpler:

**Preserve the observation. Preserve the context. Gather independent evidence. Test explanations. Keep uncertainty visible.**

---

# Why OAP Exists

Humanity now carries billions of networked devices containing cameras, clocks, GPS receivers, accelerometers, gyroscopes, magnetometers, microphones, and other sensors.

Most of the time we use this astonishing planetary instrument network to photograph lunch.

OAP explores a more interesting possibility:

> **What if ordinary devices could become voluntary scientific instruments when something unusual happens?**

Today, when an anomalous event is reported, the normal process is terrible.

Someone records a video.

The video is compressed.

It is uploaded to a social platform.

Someone downloads it.

It gets reposted.

The original timestamp disappears.

The original uploader becomes difficult to identify.

The recording location is vague.

People begin arguing about whether it is an aircraft, drone, rocket, star, atmospheric effect, hoax, extraterrestrial vehicle, portal, or particularly ambitious streetlamp.

Days or weeks later, somebody finally asks the questions that should have been asked while the event was occurring:

* Were there aircraft there?
* Were satellites passing overhead?
* Was there a rocket launch or reentry?
* What was the weather?
* Were there thunderstorms?
* What astronomical objects were visible?
* Did anyone else see it?
* From where?
* At what time?
* Did nearby cameras capture anything?
* Does the claimed recording date match the sky?
* Is this the original media?
* Have similar events already been explained?

By then much of the useful evidence may be gone.

OAP is intended to move that investigation closer to the moment of observation.

---

# The Core Idea

OAP adds a collaborative anomaly layer to a live spatial-intelligence platform.

When somebody observes something unusual, they can create an **Anomaly Event**.

An event can contain:

* approximate coordinates
* date and time
* uncertainty in location and time
* event category
* visual or behavioral characteristics
* a short description
* links to original media
* links to other sources
* observations from other people
* relevant public-data context
* proposed explanations
* investigations
* evidence supporting or contradicting those explanations
* current status

The event then appears geographically within OAP.

If it is happening now, nearby or interested users may receive a request for independent observation.

The system can also provide the event to participating software and AI agents.

The result is not a social-media post.

It is a growing **evidence record**.

---

# OAP Is Not a UFO Database

UAP and UFO reports are an obvious early use case because they demonstrate the problem exceptionally well.

They are not the architectural foundation of OAP.

The primary record is:

`AnomalyEvent`

not:

`UFOReport`

An anomaly might eventually be identified as:

* an aircraft
* a drone
* a balloon
* a satellite
* a planet
* a meteor
* a rocket launch
* a reentry
* atmospheric optics
* lightning
* aurora
* an unusual cloud
* a camera artifact
* an AI-generated video
* a deliberate hoax
* an infrastructure event
* an unknown natural phenomenon
* an unknown engineered phenomenon
* something else entirely

Or the available evidence may simply remain insufficient.

That last result matters.

**Unresolved does not mean extraordinary.**

It means unresolved.

---

# Scientific Neutrality

OAP should never be designed around reaching a preferred answer.

A contributor who believes every anomalous event has a conventional explanation should be able to use OAP.

A contributor who believes some UAP reports represent unknown technology should be able to use OAP.

A researcher interested only in meteors should be able to use OAP.

A developer who wants to study atmospheric phenomena should be able to use OAP.

The platform should not decide which worldview its users must possess.

The evidence system should make unsupported conclusions difficult regardless of which conclusion somebody wants.

The preferred question is not:

> "What do we think this is?"

It is:

> **"What observations would distinguish the competing explanations?"**

---

# Observation and Explanation Are Different Things

OAP must preserve a strong separation between what was observed and what somebody thinks caused it.

For example:

## Observation

* approximately circular
* luminous
* approximately two degrees across
* stationary for twelve seconds
* then appeared to move rapidly east
* recorded from two locations

## Hypotheses

* aircraft
* drone
* satellite flare
* lens reflection
* astronomical object
* atmospheric phenomenon
* manipulated media
* unknown

A tag such as:

`spatial distortion`

describes appearance.

It does **not** mean spacetime was actually distorted.

Likewise:

`portal-like`

is a morphology label.

It is not a physics conclusion.

This distinction should remain intact throughout the project's lifetime.

---

# Real-Time Investigation

God's Eye View provides something that traditional anomaly databases generally cannot:

**live context.**

When an event is reported while it is occurring, OAP can query whatever relevant public information is available.

Depending on location, time, available services, and licensing, that might include:

* aircraft telemetry
* publicly visible military aircraft telemetry
* satellite positions
* rocket launches
* orbital information
* reentries
* weather
* lightning
* astronomical information
* ships
* earthquakes
* fires
* public cameras
* traffic
* other nearby anomaly reports
* other public spatial data sources

Not every source will be available everywhere.

Some sources may be delayed.

Some may be incomplete.

Some may be inferred or modeled.

A missing result must never automatically become evidence that nothing existed.

OAP inherits an important principle from God's Eye View:

> **Data freshness and data quality must remain visible.**

Live, delayed, reconstructed, inferred, simulated, unavailable, and incomplete information are not interchangeable.

---

# Real-Time Verification Is Evidence, Not Admission

An event does not have to be verified through God's Eye in real time in order to exist within OAP.

That would create an obvious failure mode:

Something interesting happens while nobody is watching, therefore the system discards it.

Instead, real-time context increases the evidence quality of an event.

An event may therefore be:

* reported only
* supported by real-time contextual data
* independently observed
* corroborated by multiple observers
* investigated
* resolved
* unresolved
* disputed
* insufficiently documented

The evidence record should tell users what we know and how we know it.

---

# Turn Phones Into Scientific Instruments

One of OAP's most important long-term ideas is turning ordinary phones into a voluntary distributed observation network.

Imagine an event is reported nearby.

A participating user receives:

> **Live observation requested**

The user opens OAP.

Instead of merely saying "take a video," the application can help create a structured observation.

With the user's permission and where the hardware/browser provides it, an observation might contain:

* UTC timestamp
* geographic coordinates
* GPS accuracy
* camera direction
* device pitch
* device roll
* compass heading
* camera field of view
* zoom
* exposure information
* frame rate
* accelerometer readings
* gyroscope readings
* magnetometer readings
* barometric readings
* audio
* device capability information

Not every device exposes every measurement.

OAP should record what is available rather than pretending missing sensor data exists.

The goal is to transform:

> "I filmed something weird."

into something closer to:

> "At this known position and known time, a camera pointed in this measured direction recorded this observation."

That is a much more useful scientific record.

---

# An Observation Is More Than Media

OAP should treat an observation as:

**measurement + provenance + time + location + optional media**

A video alone is not the scientific object.

The observation is.

An observation might eventually come from:

* a phone
* a webcam
* a DSLR
* a telescope
* a dedicated camera
* an RF sensor
* a weather station
* a Raspberry Pi sensor package
* an astronomical instrument
* another software system
* a device nobody has invented yet

Mobile phones are simply the easiest globally distributed sensor platform available today.

---

# Mobile First, Not Mobile Only

OAP should be designed mobile-first because mobile devices provide the most compelling observation workflow.

However, desktop systems should not be artificially prevented from contributing observations.

A desktop user might possess:

* an external webcam
* a telescope
* a calibrated scientific camera
* a radio receiver
* specialized sensors
* custom hardware

A phone is convenient.

It is not inherently superior scientific equipment.

The interface should therefore be **capability-aware**, not device-prejudiced.

---

# Humans Do Not Need AI

OAP must remain fully usable without artificial intelligence.

A human should be able to:

* browse the globe
* inspect historical events
* inspect current events
* report something unusual
* respond to an observation request
* contribute evidence
* inspect competing hypotheses
* investigate an event
* follow an event
* receive alerts
* see how an event was resolved

without owning an AI subscription, API key, agent, GPU, or mysterious folder containing seventeen Python environments.

AI is optional.

That requirement is fundamental.

---

# Agents Are Welcome

Although AI is optional, agents could make the network much more capable.

Someone might connect:

* a general research agent
* a weather specialist
* an orbital-analysis agent
* an aviation agent
* a media-forensics agent
* an astronomy agent
* a locally hosted model
* a cloud model
* a university research system
* a custom autonomous program

OAP should eventually allow people to connect their own agent without requiring that agent to be built specifically for this project.

The likely architecture is:

**Open Anomaly Protocol → API → MCP/SDK/Webhook adapters → arbitrary agents**

MCP or any future agent standard should remain an adapter rather than becoming the permanent foundation of OAP.

Standards change.

The anomaly/evidence model should survive them.

---

# Open Anomaly Protocol

The **Open Anomaly Protocol** is the interoperable technical layer underneath the Open Anomaly Project.

Its purpose is to allow independent software to understand concepts such as:

* events
* observations
* evidence
* sources
* hypotheses
* investigations
* resolutions
* alerts
* uncertainty
* provenance

A developer should eventually be able to build a completely different interface and still participate in the same scientific ecosystem.

Likewise, somebody should be able to build an independent agent and point it at an OAP-compatible event.

The protocol should remain:

* public
* documented
* implementation-neutral where possible
* vendor-neutral
* model-neutral
* transport-neutral where practical

OAP should not depend on one AI company, one model, or one commercial platform surviving forever.

---

# Distributed Investigation

No single AI agent needs to watch Earth continuously.

No single server needs to investigate everything.

No single organization should become the authority deciding what every anomalous event means.

Instead, OAP can become a distributed network.

One participant might run an aviation-analysis agent.

Another might specialize in satellite trajectories.

Another might investigate atmospheric events.

Another might examine video provenance.

Another might contribute only when personally interested.

Humans can participate manually.

Agents can participate automatically.

A user's agent might be offline for days and then be asked:

> Investigate this event.

Another person might run a node continuously.

OAP should allow both.

---

# Agents Are Not Votes

Five AI agents agreeing does not necessarily mean five independent pieces of evidence exist.

They might:

* use the same underlying model
* query the same database
* rely on the same article
* repeat the same incorrect assumption
* inherit the same training bias

Therefore OAP should eventually distinguish:

**independent evidence**

from:

**independent investigators**

and from:

**independent models**

These are not the same thing.

Ten agents deriving their answer from one aircraft database still represent approximately one independent aircraft-data source.

Evidence diversity matters more than raw vote count.

---

# Human and Machine Collaboration

One particularly promising OAP workflow is a human-machine handoff.

A live anomaly appears.

Nearby humans provide physical observations.

Their phones provide measurements.

Public sources provide context.

Agents perform tedious comparison and analysis.

Humans review conclusions and challenge them.

Other agents test competing explanations.

This allows humans to contribute something an agent cannot obtain alone:

**physical observation of the real world.**

Agents contribute something humans are terrible at doing repeatedly:

**checking thirty boring datasets at 2:13 AM without becoming distracted by snacks.**

Neither needs to replace the other.

---

# Historical Events

OAP should include historically important unresolved or formerly unresolved events.

However, this is intentionally **not** an attempt to reconstruct the complete historical state of Earth.

Historical records should initially be lightweight.

They may contain:

* coordinates
* coordinate uncertainty
* date
* approximate time
* time uncertainty
* category
* morphology
* event summary
* primary and secondary sources
* evidence types
* known explanations
* current status
* review history

These records can appear as points on the globe.

They provide context for comparison and pattern analysis.

---

# Why OAP Does Not Archive the Entire Past

God's Eye View's original documentation makes an important architectural observation:

**the present is comparatively cheap; reconstructing the past is expensive.**

Displaying current public feeds can involve requesting data when it is needed.

Reconstructing what Earth looked like at arbitrary historical moments requires continuously storing enormous time-series datasets.

Aircraft move.

Ships move.

Weather changes.

Satellite configurations change.

Traffic changes.

Cameras change.

Infrastructure changes.

Feeds update constantly.

A true historical God's Eye would require substantial ingestion, storage, indexing, tiling, serving, and compute.

OAP should not casually inherit that problem.

Instead, it follows an **event-centric archival model**.

---

# Event-Centric Archival

When something interesting happens, preserve information relevant to that event.

Do not attempt to preserve everything happening everywhere.

Conceptually:

```text
Entire live world
        |
        v
Anomaly reported
        |
        v
Relevant place + relevant time
        |
        v
Query available sources
        |
        v
Extract relevant evidence/context
        |
        v
Preserve compact event record
```

For example:

OAP does not need to permanently store every aircraft flying over North America.

For Event X, it may preserve the fact that several relevant aircraft were present in the region during the observation window, including the source and retrieval time.

This produces a tiny scientific record compared with archiving the global feed continuously.

---

# The Evidence Cone

A useful conceptual model is an **Evidence Cone**.

Each live anomaly defines a region of space and time worth examining.

Example:

* event coordinates
* ± location uncertainty
* event timestamp
* ± time uncertainty

The system may initially inspect a modest geographic/time window around the report.

If investigation suggests the event moved quickly or may originate elsewhere, investigators can widen that window.

The appropriate search radius depends on the phenomenon.

A meteor may require a very large geographic comparison.

A street-level light phenomenon may require only a neighborhood.

The Evidence Cone should therefore be a search abstraction, not a universal fixed radius.

---

# Do Not Become a Video Hosting Platform

The initial OAP should preferably store links and structured metadata rather than enormous quantities of user video.

For example:

* original source URL
* media platform
* upload time
* claimed capture time
* uploader information where publicly appropriate
* source chain
* media hash if obtainable
* analysis
* metadata
* relationship to an observation

This avoids unnecessary:

* storage cost
* bandwidth cost
* copyright exposure
* moderation burden
* infrastructure complexity

Future voluntary archival options may be worthwhile.

They should be deliberate additions rather than accidental consequences of the first release.

---

# Keep Resolved Events

When an anomaly receives a convincing conventional explanation, **do not delete it**.

Resolved events may be among OAP's most valuable records.

A well-documented rocket spiral becomes a reference for future rocket-spiral reports.

A resolved lens flare becomes a reference for future lens-flare reports.

A Starlink observation becomes useful when another observer sees Starlink.

Over time OAP can accumulate a reference library of:

* balloons
* drones
* rockets
* reentries
* meteors
* satellites
* atmospheric optics
* aircraft
* astronomical objects
* camera artifacts
* AI-generated media
* other recurring phenomena

Debunking therefore does not remove scientific value.

It creates it.

---

# Preserve Disagreement

Investigations should not overwrite one another.

If Investigator A argues for an aircraft explanation and Investigator B identifies evidence contradicting that explanation, both should remain part of the record.

A later resolution can explain why one hypothesis became stronger.

Science benefits from preserving the reasoning path.

An event history might therefore contain:

1. initial observation
2. aircraft hypothesis proposed
3. conflicting altitude evidence submitted
4. aircraft hypothesis weakened
5. satellite hypothesis proposed
6. orbital-data match discovered
7. event resolved

That is more useful than changing one database field from:

`UNKNOWN`

to:

`SATELLITE`

and deleting everything that happened between them.

---

# Provenance Matters

A viral repost is not equivalent to an original recording.

OAP should care about source chains.

Whenever practical, preserve distinctions between:

* original observer
* original upload
* repost
* edited media
* screenshot
* screen recording
* news coverage
* commentary
* derivative AI analysis

If somebody submits a repost, the platform should help investigators search for the earliest available source rather than treating popularity as authenticity.

---

# Negative Observations Matter

Suppose four observers receive a verification alert.

Three see the phenomenon.

One has a clear view of the predicted region and sees nothing.

That negative observation is potentially valuable.

It may help constrain:

* altitude
* location
* visibility
* direction
* duration
* whether observers are describing the same phenomenon

OAP should therefore allow structured:

* observed
* not observed
* obstructed
* uncertain

responses.

"No" is data.

---

# Uncertainty Must Be First-Class Data

Real-world reports are messy.

Somebody may know:

* the exact GPS coordinate but only approximate time
* the exact timestamp but vague location
* approximate direction
* no altitude
* unknown camera zoom

OAP should not turn uncertainty into fake precision.

Prefer:

`21:00 ± 15 minutes`

over inventing:

`21:00:00`

Prefer:

`approximately 5 km radius`

over presenting an exact pin as authoritative.

Scientific credibility depends partly on being comfortable displaying what is not known.

---

# Privacy

OAP should study events, not build dossiers on people.

The project should preserve the responsible-use boundary established by God's Eye View.

OAP should not become infrastructure for:

* named-person tracking
* face recognition
* stalking
* mapping private individuals
* reconstructing someone's movements
* identifying anonymous observers
* covert surveillance

Observer location deserves particular care.

Scientific analysis might require relatively accurate sensor coordinates.

The public interface generally does not.

OAP should therefore support different representations such as:

**internal scientific coordinate**

and

**public privacy-preserving region**

A user's historical observations should not quietly turn into a public movement history.

---

# Public Data Does Not Mean Risk-Free Data

God's Eye View is built primarily around public signals.

OAP should maintain that philosophy.

But contributors must remember:

> Publicly accessible information can still be misused.

Combining many individually harmless datasets can reveal more than any one source reveals alone.

Developers adding new correlation features should consider not just:

> "Can we technically do this?"

but:

> **"Does this help investigate events, or does it primarily help investigate people?"**

The former belongs here.

The latter generally does not.

---

# OAP Is Not an Emergency System

Neither God's Eye View nor OAP should be treated as authoritative operational intelligence.

Third-party data may be:

* delayed
* incomplete
* inaccurate
* unavailable
* modeled
* inferred
* simulated

Therefore OAP should not present itself as a replacement for:

* emergency services
* aviation systems
* maritime navigation
* weather warning authorities
* medical systems
* public-safety authorities

A scientifically useful exploratory network does not magically become a certified operational system because somebody added a glowing map.

---

# Accounts

OAP should permit anonymous public browsing.

Accounts exist primarily so participants can retain:

* alert preferences
* followed events
* observation history
* contribution history
* saved investigations
* notification preferences
* agent connections
* provider connections

The project should avoid unnecessary identity collection.

Users should not need to reveal more personal information than the system genuinely requires.

---

# AI Credentials and Connected Agents

Some users may want OAP to remember their agent/provider connection so they do not repeatedly enter API credentials.

Those secrets must be treated as credentials, not ordinary preferences.

API keys must never be:

* stored in plaintext
* embedded in frontend source
* written to URLs
* returned to the browser after storage
* exposed in logs
* included in analytics events

Use encrypted user-scoped server-side storage or an appropriate secrets-management system.

Users must be able to:

* add credentials
* replace credentials
* revoke credentials
* test connections
* see which provider is connected

without OAP revealing the secret again.

Whenever OAuth or a safer provider-native authorization mechanism exists, it may be preferable to raw long-lived keys.

---

# Open Source Means More Than Publishing Code

OAP should be forkable.

A university should be able to deploy its own version.

A local astronomy club should be able to customize it.

A developer should be able to build a specialized anomaly network.

A researcher should be able to experiment with different analysis techniques.

Someone should eventually be able to create another OAP-compatible client entirely.

The protocol and data model matter because open source should mean more than:

> "You may inspect our website."

It should mean:

> **"You can build your own version of the network."**

---

# Forks Are Encouraged

Future developers should not feel obligated to reproduce every feature in the canonical OAP fork.

Interesting forks might focus entirely on:

* astronomy
* meteors
* severe weather
* atmospheric optics
* maritime observations
* earthquakes
* environmental monitoring
* wildlife observations
* infrastructure events
* radio-frequency anomalies
* orbital activity
* scientific education

If the underlying event/evidence model remains interoperable, specialization can strengthen rather than fragment the ecosystem.

---

# Data and Licensing

God's Eye View's application source is MIT licensed.

That does **not** mean every dataset, visual asset, API, or external service used by the application is MIT licensed.

Third-party data retains its own:

* license
* terms of service
* attribution requirements
* redistribution restrictions
* commercial-use restrictions
* API limitations

OAP contributors must preserve the upstream project's careful data-source attribution model.

When adding a source:

1. identify the provider
2. identify its license or terms
3. determine whether OAP may redistribute the data
4. prefer runtime retrieval when redistribution is prohibited
5. preserve required attribution
6. document limitations
7. respect rate limits
8. do not misrepresent inferred information as authoritative

An open-source application can still depend on data that is not open source.

That distinction must remain visible.

---

# Honest Data Presentation

If a value is simulated, label it simulated.

If a trajectory is reconstructed, label it reconstructed.

If information is delayed, label it delayed.

If coverage is partial, label it partial.

If a source failed, label it unavailable.

If a result is inferred, label it inferred.

Do not quietly upgrade uncertain information into fact simply because confident-looking graphics are prettier.

This principle already exists within God's Eye View and should become even more important within OAP.

---

# Scientific Confidence

Avoid one giant magical:

`ANOMALY CONFIDENCE = 94%`

number unless its meaning is rigorously defined.

Different questions have different confidence.

For example:

* confidence that an event physically occurred
* confidence in its location
* confidence in its timestamp
* confidence that two observations concern the same event
* confidence that an aircraft explains it
* confidence that media is authentic
* confidence that available conventional explanations have been adequately checked

Those are different measurements.

OAP should avoid collapsing them into a number that looks scientific while communicating almost nothing.

---

# Extraordinary Claims

OAP should neither ban extraordinary hypotheses nor privilege them.

An investigator may propose an unusual physical explanation if appropriate.

It should be treated exactly like every other hypothesis:

**What does it predict?**

**What evidence supports it?**

**What evidence contradicts it?**

**What observations would distinguish it from alternatives?**

For example, something visually resembling a "portal" does not establish a spacetime portal.

But an investigator could compare the observation against predicted signatures of:

* optical artifacts
* atmospheric effects
* plasma
* projection
* image manipulation
* gravitational lensing
* speculative spacetime geometries

The platform should be curious enough to ask unusual questions and disciplined enough not to confuse asking with answering.

---

# Pattern Discovery

Once OAP accumulates enough events, the database itself may become scientifically interesting.

Researchers could examine:

* geographic clustering
* temporal clustering
* recurring locations
* repeated morphology
* trajectories
* altitude distributions
* weather correlation
* astronomical correlation
* launch correlation
* aircraft correlation
* satellite correlation
* similarities among unresolved events

But raw maps can mislead.

More people produce more reports.

More cameras produce more recordings.

Clear nights produce more sky observations.

Cities contain more observers than deserts.

Internet access changes reporting probability.

Future statistical analysis should therefore consider biases such as:

* population density
* device ownership
* camera density
* internet penetration
* weather
* daylight
* aviation traffic
* reporting culture
* platform popularity
* sensor coverage

A cluster of sightings is not automatically a cluster of phenomena.

---

# What OAP Should Not Become

OAP should resist becoming:

## A conspiracy platform

Evidence should outrank ideology.

## A debunking performance platform

The objective is explanation, not humiliating people for reporting something unusual.

## An alien detector

The architecture should remain phenomenon-neutral.

## A surveillance platform

Events and systems are the subjects, not private individuals.

## An AI-only product

Humans remain first-class participants.

## A giant permanent surveillance archive

Store scientifically relevant event context rather than recording Earth indiscriminately.

## A popularity contest

Votes do not determine physical reality.

## A social-media engagement machine

No design decision should intentionally reward sensational conclusions over careful investigation.

## An authority pretending uncertainty does not exist

"Insufficient evidence" is a legitimate result.

---

# What OAP Could Become

With enough developers, observers, researchers, and specialized tools, OAP could grow into something much more interesting than its initial anomaly map.

It could become a voluntary **distributed planetary observatory**.

Thousands or eventually millions of ordinary devices could occasionally participate in coordinated observation.

A future event might trigger observation requests across a geographic region.

Phones could provide separate viewing positions.

Agents could correlate public telemetry.

Astronomy systems could check the sky.

Weather systems could examine atmospheric conditions.

Media tools could examine provenance.

Independent researchers could challenge conclusions.

Multiple observations could eventually support:

* triangulation
* approximate altitude estimation
* trajectory reconstruction
* speed estimation
* cross-camera correlation
* event clustering

Specialized hardware nodes could contribute higher-quality measurements.

Scientific organizations could publish OAP-compatible observations.

Researchers could export anonymized datasets.

Students could investigate real events as science exercises.

Developers could create entirely new sensor types.

The system could evolve from:

> "What was that weird thing?"

into:

> **"What can a distributed network of ordinary humans and machines learn about unusual events occurring on Earth?"**

---

# A Possible Future Beyond Anomalies

The architecture required for OAP has uses beyond strange lights in the sky.

A distributed, voluntary observation network could eventually assist research involving:

* meteors
* atmospheric events
* auroras
* wildlife
* environmental change
* severe weather
* astronomical observations
* infrastructure failures
* earthquakes
* unusual radio phenomena
* satellite observations

The first compelling use case may be anomalous phenomena.

The deeper idea is:

> **Give ordinary people infrastructure for participating in observation and evidence collection.**

---

# Community Culture

OAP should welcome both skepticism and curiosity.

Healthy contributions include:

* "I think this is probably a rocket."
* "The rocket explanation does not fit this timestamp."
* "Here is another independent observation."
* "This media appears edited."
* "We don't have enough information."
* "I found the original source."
* "Our previous explanation was wrong."
* "Here is a new hypothesis and how we could test it."

Unhealthy contributions include:

* treating disagreement as evidence of conspiracy
* declaring extraordinary conclusions without evidence
* dismissing observations solely because they sound strange
* attacking observers
* burying contradictory evidence
* manipulating confidence scores
* brigading event conclusions
* using OAP to identify or track private individuals

The platform should make epistemic humility easier than tribal warfare.

Humanity already has plenty of software for the latter.

---

# Contributor Questions

Before adding a major feature or data source, ask:

### Does this improve observation?

### Does this improve provenance?

### Does this improve corroboration?

### Does this help distinguish competing explanations?

### Does this expose uncertainty honestly?

### Does this preserve privacy?

### Does this study events rather than people?

### Does this require storing data we do not actually need?

### Does this data source permit our intended use?

### Does this make OAP more interoperable or more locked in?

### Can a non-AI user still benefit?

### Would an independent researcher understand where this conclusion came from?

If the answers are good, the feature probably belongs.

---

# Architectural Restraint

OAP should begin small.

The first useful version does not require:

* global historical reconstruction
* autonomous worldwide AI monitoring
* native mobile applications
* massive video storage
* sophisticated machine-learning infrastructure
* automated triangulation
* a giant anomaly catalog
* blockchain
* custom satellites
* a bunker beneath a volcano

The useful first version requires:

* an anomaly map
* event records
* accounts
* observations
* source links
* mobile-friendly reporting
* alerts
* evidence
* hypotheses
* investigation history
* lightweight historical events
* open interfaces for future tools

Build extension points for the future.

Do not build the entire future before anybody has submitted Event #1.

---

# Relationship to God's Eye View

OAP exists because God's Eye View already solved much of the difficult foundation required to make this idea interesting.

God's Eye View provides an extensible spatial interface capable of combining multiple public signals on an interactive 3D Earth.

OAP should respect that architecture rather than unnecessarily replacing it.

Upstream God's Eye principles worth preserving include:

* public-data orientation
* inspectable/open implementation
* modular data layers
* clear source attribution
* explicit freshness/status information
* honest distinction between live and modeled data
* keeping private credentials server-side
* avoiding named-person tracking
* respecting data-provider terms
* avoiding claims that public-data inference is authoritative intelligence
* maintaining a fast, hackable exploratory client

Developers working on OAP should read the upstream project's:

* README
* CONTRIBUTING
* SECURITY
* DATA_SOURCES
* CURRENT-STATE
* LICENSE

before significantly modifying inherited architecture.

OAP is an extension of that work, not an excuse to ignore its lessons.

---

# The Mission in One Sentence

**Open Anomaly Project exists to create an open, privacy-conscious, scientifically curious network in which anyone can document unusual events, anyone can help investigate them, ordinary devices can contribute meaningful observations, AI can assist without becoming mandatory, and every conclusion remains traceable to the evidence that produced it.**

---

# If This Project Succeeds

Success is not:

> "OAP proves UFOs are aliens."

Success is not:

> "OAP debunks every UFO."

Success looks more like this:

Something unusual happens.

Someone notices.

The observation is preserved.

Other people nearby are able to look.

Their devices collect useful measurements.

Relevant public information is captured before it disappears.

Independent evidence is separated from repeated claims.

Humans and optional agents propose explanations.

Those explanations make predictions.

Evidence eliminates some possibilities.

A mundane answer is celebrated when the evidence supports it.

An unresolved answer remains unresolved when it does not.

Years later, the record can still be examined.

And if humanity ever encounters a genuinely new phenomenon, instead of possessing one compressed vertical video accompanied by 40,000 comments arguing underneath it, we possess a geographically distributed, timestamped, provenance-aware collection of observations gathered while the event was actually occurring.

That seems worth building.
