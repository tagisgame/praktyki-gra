# praktyki-gra

Plansza ma 28x14
`............................
............................
............................
............................
............................
............................
............................
............................
.......................@#S.. // right
............................
............................
............................
............................
............................`

Steguje się bohaterem oznaczonym jako `@`, gracz wpisuje komendy ruchu: up, down, left, right, ew. obsługa strzałek. Gracz posiada 10 HP.

Na planszy mogą znaleść się potwory, `S` wąż z 2 HP oraz `D` smok 25 HP. Potwory poruszają się w kierunku aktualnej pozycji gracza. Potwory zadają obrażenia równe ich HP.

Na planszy mogą znaleść się dwa rodzaje przedmiotów: `h` dodaje 5 HP, `p` odejmuje 5 HP.

Na planszy mogą znaleść się również bronie: `d` szylet 1 ATK oraz topór `a` 20 ATK.

Na planszy znajdują się również ściany `#`.

W przypadku gdy HP gracza bądź potwora jest <= 0 gracz ginie i gra rozpoczyna się od nowa.
