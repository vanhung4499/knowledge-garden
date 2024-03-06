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

  // Backtrack to find the optimal solution
  let res = [];
  let i = n, j = needContainer;
  while (i > 0 && j > 0) {
    if (dp[i][j] === dp[i - 1][j]) {
      i--;
    } else {
      let k = Math.max(j - listings[i - 1].container, 0);
      res.push(listings[i - 1]);
      j = k;
      i--;
    }
  }

  // Print the result
  for (let l of res) {
    console.log(`[Contract with] ${l.name} ${l.container} container, price: ${l.totalCost}`);
  }
  console.log(`[Summary] total cost ${dp[n][needContainer]}`);
}

// TEST CASE
function test1() {
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
}


function test2() {
  const neededContainer = 10;
  const listings = [
    {
      name: "Container renter A",
      container: 5,
      totalCost: 5,
    }, {
      name: "Container renter B",
      container: 2,
      totalCost: 10,
    }, {
      name: "Container renter C",
      container: 2,
      totalCost: 3,
    },
  ];

  rentContainer(neededContainer, listings);
}

function test3() {
  const neededContainer = 10;
  const listings = [
    {
      name: "Container renter A",
      container: 5,
      totalCost: 5,
    }, {
      name: "Container renter B",
      container: 2,
      totalCost: 10,
    }, {
      name: "Container renter C",
      container: 10,
      totalCost: 3,
    },
  ];

  rentContainer(neededContainer, listings);
}

console.log('Test case 1');
test1();
console.log('-----------------');

console.log('Test case 2');
test2();
console.log('-----------------');


console.log('Test case 3');
test3();
console.log('-----------------');

