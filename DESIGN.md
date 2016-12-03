
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
      uniqueID:“xyz”,
      minBet:10,
      players:[  
         {  
            sessionID:“abc123”,
            hand:[  
               {  
                  suite:“spades”,
                  number:1
               },
               ...
            ],
            chips_points:50
         }
      ],
      starttimestamp:“1234567890”,
      lastmovetimestamp:“1234567890”,
      deck:[  
         {  
            suite:“spades”,
            number:1,
            discarded:false
         }
      ],
      faceups:[  
         {  
            suite:“hearts”,
            number:2
         }
      ]
   }
]
```
