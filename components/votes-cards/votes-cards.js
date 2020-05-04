const PEOPLE = [
  {
    id: 1,
    name: "Kanye West",
    image: "images/Kanye.png",
    time_ago: "1 month",
    category: "Entertainment",
    description:
      "Vestibulumn diam ante, porttitor a odio eget, rhoncus neque. Aenean eu velit libero",
    positive_votes: 64,
    negative_votes: 36,
  },
  {
    id: 2,
    name: "Mark Zuckerberg",
    image: "images/Mark.png",
    time_ago: "1 month",
    category: "Business",
    description:
      "Vestibulumn diam ante, porttitor a odio eget, rhoncus neque. Aenean eu velit libero",
    positive_votes: 5,
    negative_votes: 36,
  },
  {
    id: 3,
    name: "Cristina Fernández de Kirchner",
    image: "images/Cristina.png",
    time_ago: "1 month",
    category: "Politics",
    description:
      "Vestibulumn diam ante, porttitor a odio eget, rhoncus neque. Aenean eu velit libero",
    positive_votes: 64,
    negative_votes: 226,
  },
  {
    id: 4,
    name: "Malala Yousafzai",
    image: "images/Malala.png",
    time_ago: "1 month",
    category: "Entertainment",
    description:
      "Vestibulumn diam ante, porttitor a odio eget, rhoncus neque. Aenean eu velit libero",
    positive_votes: 164,
    negative_votes: 26,
  },
];

const TPL_Results = (item) =>
  `<section class="card-votes" style="background-image: url(${item.image})">
    <h2 class="card-votes__name 
      ${
        positivePercentage(item.positive_votes, item.negative_votes) >= 50
          ? "thumbsUp"
          : "thumbsDown"
      }">
        ${item.name}
    </h2>
    <p class="card-votes__time">
      <strong>${item.time_ago} ago</strong> 
      in ${item.category}
    </p>
    <p class="card-votes__description">${item.description}</p>
    <p class="card-votes__thankyou hidden">Thank you for voting!</p>
    <div class="card-votes__buttons">
      <figure class="card-votes__thumbs-up">
        <img src='images/thumbsUp.svg' alt='thumb up approving' />
      </figure>
      <figure class="card-votes__thumbs-down">
        <img src='images/thumbsDown.svg' alt='thumb down unapproving' />
      </figure>
      <a class="card-votes__vote-button js-vote-btn" data-vote="" 
        data-userid="${item.id}">
          Vote now
      </a>
    </div>
    <div class="card-votes__button-vote-again hidden">
      <a class="card-votes__vote-button js-vote-again">
        Vote again
      </a>
    </div>
    <div class="card-votes__percentage percentage">
      <div class="percentage__positive" 
        style="width:${positivePercentage(
          item.positive_votes,
          item.negative_votes
        )}%">
          <img src='images/thumbsUp.svg' alt='thumb up approving' />
          <span>
            ${positivePercentage(item.positive_votes, item.negative_votes)}%
          </span>
      </div>
      <div class="percentage__negative" 
        style="width:${
          100 - positivePercentage(item.positive_votes, item.negative_votes)
        }%"> 
          <img src='images/thumbsDown.svg' alt='thumb up unapproving' />
          <span>
            ${
              100 - positivePercentage(item.positive_votes, item.negative_votes)
            }% 
          </span>
      </div>
    </div>
  </section>`;

function positivePercentage(positive, negative) {
  return (positive / ((positive + negative) / 100)).toFixed(1);
}

function addListenersUp() {
  let votesUp = document.querySelectorAll(".card-votes__thumbs-up");
  if (votesUp) {
    votesUp.forEach((btnUp) => {
      btnUp.addEventListener("click", function () {
        this.classList.add("active");
        this.nextElementSibling.classList.remove("active");
        let parent = this.parentElement;
        parent.querySelector(".js-vote-btn").dataset.vote = "upVote";
      });
    });
  }
}

function addListenersDown() {
  let votesDown = document.querySelectorAll(".card-votes__thumbs-down");
  if (votesDown) {
    votesDown.forEach((btnDown) => {
      btnDown.addEventListener("click", function () {
        this.classList.add("active");
        this.previousElementSibling.classList.remove("active");
        let parent = this.parentElement;
        parent.querySelector(".js-vote-btn").dataset.vote = "downVote";
      });
    });
  }
}

function addListenersButtonVote() {
  let votes = document.querySelectorAll(".js-vote-btn");
  if (votes) {
    votes.forEach((btnVote) => {
      btnVote.addEventListener("click", function () {
        if (this.dataset.vote) {
          let parent = this.parentElement;
          if (parent) {
            let container = parent.parentElement;
            if (container) {
              container
                .querySelector(".card-votes__description")
                .classList.add("hidden");
              container
                .querySelector(".card-votes__thankyou")
                .classList.remove("hidden");
              container
                .querySelector(".card-votes__button-vote-again")
                .classList.remove("hidden");
              parent.classList.add("hidden");

              if (this.dataset.vote == "upVote") {
                updateStorageByUser(this.dataset.userid, "up");
              } else if (this.dataset.vote == "downVote") {
                updateStorageByUser(this.dataset.userid, "down");
              } else {
                return false;
              }
              updateLayout(this.dataset.userid, container);
            }
          }
        }
      });
    });
  }
}

function addListenersButtonAgain() {
  let voteAgain = document.querySelectorAll(".js-vote-again");
  if (voteAgain) {
    voteAgain.forEach((btnAgain) => {
      btnAgain.addEventListener("click", function () {
        let parent = this.parentElement;
        if (parent) {
          let container = parent.parentElement;
          if (container) {
            container
              .querySelector(".card-votes__description")
              .classList.remove("hidden");
            container
              .querySelector(".card-votes__thankyou")
              .classList.add("hidden");
            container
              .querySelector(".card-votes__buttons")
              .classList.remove("hidden");
            parent.classList.add("hidden");
          }
        }
      });
    });
  }
}

async function checkLocalStorage() {
  index = 0;
  PEOPLE.forEach((person) => {
    if (window.localStorage.getItem("user-" + person.id)) {
      let user = JSON.parse(window.localStorage.getItem("user-" + person.id));
      PEOPLE[index].positive_votes = user.positiveVotes;
      PEOPLE[index].negative_votes = user.negativeVotes;
      index++;
    }
  });
}

function setLocalStorage() {
  index = 1;
  PEOPLE.forEach((person) => {
    if (!window.localStorage.getItem("user-" + person.id)) {
      window.localStorage.setItem(
        "user-" + person.id,
        JSON.stringify({
          positiveVotes: person.positive_votes,
          negativeVotes: person.negative_votes,
        })
      );
    }
  });
}

function updateStorageByUser(userid, vote) {
  let user = JSON.parse(window.localStorage.getItem("user-" + userid));
  if (vote == "up") {
    window.localStorage.setItem(
      "user-" + userid,
      JSON.stringify({
        positiveVotes: user.positiveVotes + 1,
        negativeVotes: user.negativeVotes,
      })
    );
  } else if (vote == "down") {
    window.localStorage.setItem(
      "user-" + userid,
      JSON.stringify({
        positiveVotes: user.positiveVotes,
        negativeVotes: user.negativeVotes + 1,
      })
    );
  }
}

function updateLayout(userid, element) {
  let user = JSON.parse(window.localStorage.getItem("user-" + userid));
  let percentage = positivePercentage(user.positiveVotes, user.negativeVotes);
  let positive = element.querySelector(".percentage__positive");
  let negative = element.querySelector(".percentage__negative");
  positive.setAttribute("style", "width:" + percentage + "%");
  positive.querySelector("span").innerHTML = percentage + "%";
  negative.setAttribute("style", "width:" + (100 - percentage) + "%");
  negative.querySelector("span").innerHTML = 100 - percentage + "%";
}

class votesCards extends HTMLElement {
  connectedCallback() {
    this.innerHTML = PEOPLE.map((item) => TPL_Results(item)).join("");
  }
}

checkLocalStorage();
customElements.define("votes-cards", votesCards);
addListenersUp();
addListenersDown();
addListenersButtonVote();
addListenersButtonAgain();
setLocalStorage();
