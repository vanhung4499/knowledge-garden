# Section I - Alogrithm

## The problem

**A logistic company plan to rent a large amount of empty container.**

Your task is to design an algorithm to help logistic company able to rent **enough containers** (highest priority) at the lowest price.

Input: a `needContainer` number and a `listings` of container information including `name`, `totalCost`, `container`. 

Example:

- Input:
```js
      const neededContainer = 3;
      const listings = [
            {
              name: "Container renter A",
              container: 1,
              totalCost: 1,
            }, {
              name: "Container renter B",
              container: 2,
              totalCost: 1,
            }, {
              name: "Container renter C",
              container: 3,
              totalCost: 3,
            }, 
        ];
```

- Output:

```sh
[Contract with] Container renter B 2 container, price: 1
[Contract with] Container renter A 1 container, price: 1
[Summary] total cost 2
```

- Explain: The optimal price is to rent 1 container from renter A and 2 containers from renter B, the total cost of them is 2. (Same total cost but the
different provider is accepted)

## Thinking

The first i think i will use **Greedy algorithm** to solve this problem.
We can sort the `listings` by `totalCost/numContainer` (price per container) and then choose the renter with the lowest price per container. But this solution is not always correct. It is a simple example that can be solved by **Greedy algorithm**: need 3 containers, and we have 2 renter: {1 container cost 1}, {3 container cost 10}.

So i rethink, for one renter, we have two choices: rent or not rent. This problem is similar to the **0/1 Knapsack problem**. We can use **Dynamic programming** to solve it.

## Solution

For this problem, we can use **Dynamic programming** to solve it.

Step to solve this problem:

- Let `dp[i][j]` be the minimum cost to rent `j` containers from the first `i` container types.

- The base case is `dp[0][0] = 0` and `dp[0][j] = Infinity` for `j > 0`.

- The recursive case is:
  - When going through the `i`-th container type, we have two choices:
    - Rent `k` containers from the `i`-th renter. The cost is `dp[i - 1][j - k] + cost[i]`. (if `j - k < 0`, we can see as `j - k == 0`)
    - Don't rent any container from the `i`-th renter. The cost is `dp[i - 1][j]`.
  - We choose the minimum cost between the two choices.

- After filling the `dp` array, we can backtrack to find the optimal solution.

- But we need to be careful with the case when we cannot rent engough containers. In this case, we need to check total container we can rent from all renter. If it is less than `needContainer`, we cannot solve the problem.

## Code

```js
function rentContainer(needContainer, listings) {

  // Check if we can rent enough containers
  const totalContainer = listings.reduce((acc, l) => acc + l.container, 0);
  if (totalContainer < needContainer) {
    totalCost = 0;
    for (let l of listings) {
      totalCost += l.totalCost;
      console.log(`[Contract with] ${l.name} ${l.container} container, price: ${l.totalCost}`);
    }
    console.log("Not enough containers");
    console.log(`[Summary] total cost ${totalCost}`);
    return;
  }

  // Dynamic programming to solve the problem
  const n = listings.length;
  // Init dp array
  const dp = Array(n + 1).fill(null).map(() => Array(needContainer + 1).fill(Infinity));
  
  // Base case
  dp[0][0] = 0;

  // Recursive case
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= needContainer; j++) {
        let k = Math.max(j - listings[i - 1].container, 0);
        dp[i][j] = Math.min(dp[i - 1][j], dp[i - 1][k] + listings[i - 1].totalCost);
      }
    }
  }

  // Backtrack to find the optimal solution
  let res = [];
  let i = n, j = needContainer;
  while (i > 0 && j > 0) {
    let k = Math.max(j - listings[i - 1].container, 0);
    // If we choose the i-th container type
    if (dp[i][j] == dp[i - 1][k]) {
      res.push(listings[i - 1]);
      j = k;
    }
    // Else we don't choose the i-th container type, dont do anything
    i--;
  }

  // Print the result
  for (let l of res) {
    console.log(`[Contract with] ${l.name} ${l.container} container, price: ${l.totalCost}`);
  }
  console.log(`[Summary] total cost ${dp[n][needContainer]}`);
}
```

## Test

```js
const neededContainer = 3;
const listings = [
  {
    name: "Container renter A",
    container: 1,
    totalCost: 1,
  }, {
    name: "Container renter B",
    container: 2,
    totalCost: 1,
  }, {
    name: "Container renter C",
    container: 3,
    totalCost: 3,
  },
];

rentContainer(neededContainer, listings);
```

All code is written in `section1.js` file. Just run `node section1.js` to see the result.

```sh
node section1.js
Test case 1
[Contract with] Container renter B 2 container, price: 1
[Contract with] Container renter A 1 container, price: 1
[Summary] total cost 2
-----------------
Test case 2
[Contract with] Container renter A 5 container, price: 5
[Contract with] Container renter B 2 container, price: 10
[Contract with] Container renter C 2 container, price: 3
Not enough containers
[Summary] total cost 18
-----------------
Test case 3
[Contract with] Container renter C 10 container, price: 3
[Summary] total cost 3
-----------------
```

All test cases are passed.

## Time complexity

The time complexity of this solution is `O(n * m)`, where `n` is the number of container types, `m` is the number of needed containers.

The algoritm cannot solve the problem if the number of renter and needContainer are too large.