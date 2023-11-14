export const defaultYaml =
`title: Lucky Larry
subtitle: Quirky human (folk hero), chaotic good
challenge_rating: 3/4
experience_points: 75
armor_class: 12 (Patchwork clothing)
max_hit_points: 18 (4d8)
speed: 25 ft.
strength: 10 (+0)
dexterity: 14 (+2)
constitution: 12 (+1)
intelligence: 6 (-2)
wisdom: 8 (-1)
charisma: 16 (+3)
actions:
  - name: Improvised Weapon
    description: "Swings a random object found nearby."
    attack_bonus: +2
    reach: "5 ft."
    damage: "4 (1d6 + 2) bludgeoning damage."
  - name: Lucky Strike
    description: "Larry's unwavering belief in luck grants him a chance to deal extra damage."
    attack_bonus: +3
    reach: "5 ft."
    damage: "6 (1d8 + 3) bludgeoning damage. Larry can roll a d20. On a roll of 20, he deals an additional 10 damage."
special_actions:
  - category: Lucky Charm
    actions:
      - name: Lucky Hunch
        description: "Larry trusts his luck to guide him. He can reroll one failed saving throw or attack roll per short rest."
      - name: Lucky Coin Toss
        description: "Larry flips a coin for decisions. Heads, he gains advantage on the next action. Tails, he gains disadvantage."
  - category: Whimsical Antics
    actions:
      - name: Comical Distraction
        description: "Larry does something hilariously absurd, distracting enemies and imposing disadvantage on their next attack."
      - name: Sudden Shenanigans
        description: "Larry pulls out a prop or gadget, causing confusion among foes and reducing their accuracy for one round."
loot:
  - name: Rabbit's Foot
    description: "A worn rabbit's foot that Larry believes brings him luck."
  - name: Lucky Coin
    description: "A tarnished coin that Larry flips for important decisions."`
;
