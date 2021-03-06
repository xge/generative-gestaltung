# Aufgabe 2: Partikel und Blending

![Screenshot](screenshot.png)

Die hier gezeigte Partikel-Engine beherrscht eine beliebige Anzahl Emitter (magenta Punkt), Attraktoren (grüner Punkt) und Repelloren (roter Punkt).  

Weitere Eigenschaften:

* damit es nicht zu Einbußen in der Framerate kommt kann eine Maximalanzahl von Partikeln definiert werden (siehe: [99-app.coffee](https://github.com/xge/generative-gestaltung/blob/master/02-particles/99-app.coffee#L13))
* sobald ein Partikel den Bildschirmausschnitt verlässt wird er gelöscht und der Emitter erzeugt einen neuen
* Constraints sind über eine Reihe von Repelloren an den Außengrenzen realisiert
* die Farbe eines Partikels wird durch dessen Nähe zu einem Attraktor/Repellor bestimmt. Umso näher der Partikel einem Kraftfeld kommt, umso heller wird er. Zwischen diesen beiden Farben (`rgba(32, 32, 32, 1.0)` und `rgba(192, 192, 192, 1.0)`) wird geblendet. Siehe: [02-Color.coffee](https://github.com/xge/generative-gestaltung/blob/master/02-particles/02-Color.coffee#L8)
* des Weiteren wird auch die Größe eines Partikels durch dessen Nähe zu einem Kraftfeld bestimmt. Siehe dazu: [06-Particle.coffe](https://github.com/xge/generative-gestaltung/blob/master/02-particles/06-Particle.coffee#L28)