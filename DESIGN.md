
# React Components:
- Room
  - Stats view
  - Table
    - Card
    - OtherPlayer
  - Hand
    - Card




#DB structure

##Games collection:
```
[
  {
    "uid" : "a1b2c3",
    "numPlayers" : 3,
    "startDate" : "12/12/2016 16:00:00",
    "started" : "true",
    "minBet" : 5,
    "pot" : 100,
    "discardDeck" :
    [
      {"card":"2H"},
      {"card":"JH"},
      ...,
      {"card":"AS"}
    ],
    "deck" :
    [
      {"card":"2S"},
      {"card":"3H"},
      ...,
      {"card":"AS"}
    ],
    "communityCards" :
    [
      {"card":"7H","faceUp":"true"},
      {"card":"5D","faceUp":"true"},
      {"card":"AD","faceUp":"true"},
      {"card":"8D","faceUp":"false"},
      {"card":"6C","faceUp":"false"}
    ],
    "players" :
    [
      { "uid":"1q2w3e", "name":"Jimmy", "cards":[{"card":"2C"},{"card":"3C"}], "chips":500, "status":"check" },
      { "uid":"8i9o0p", "name":"Nate", "cards" : [{"card":"KC"},{"card":"3D"}], "chips":445, "status":"fold"},
      { "uid":"4r5t6y", "name":"Christiaan", "cards" : [{"card":"QH"},{"card":"AD"}], "chips":751, "status":"check" }
    ]
  }
]
```
