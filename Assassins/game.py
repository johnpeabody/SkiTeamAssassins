import csv
import random
from utils import Participant

participants = []
people_remaining = -1

def create_game(csv_file = 'participants.csv'):
    # Create set of participants
    with open(csv_file, newline='') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)  # Skip header if present
        for row in reader:
            # Access columns B through E (index 1 to 4)
            first, last, email, phone = row[1], row[2], row[3], row[4]
            p = Participant(first, last, email, phone, None)
            participants.append(p)

    global people_remaining
    people_remaining= len(participants)

def save_target_chain(filename = 'targets.csv'):
    with open(filename, mode='w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["First", "Last", "Email", "Phone", "TargetEmail"])
        for p in participants:
            target_email = p.get_target().get_email() if p.get_target() else ""
            writer.writerow([
                p.get_first(),
                p.get_last(),
                p.get_email(),
                p.get_phone(),
                target_email
            ])

def create_target_chain():
    
    # check to see there is a list of participants
    if not participants:
        print("no participants")
        return
    
    # Randomize targets
    random.shuffle(participants)

    for i in range(len(participants)):
        current = participants[i]
        target = participants[(i + 1) % len(participants)]
        current.set_target(target)

    save_target_chain() 
    print("target chain saved")


def load_game(filename='targets.csv'):
    
    global participants, people_remaining
    participants = []
    email_to_participant = {}

    # Step 1: Read all participants into list and build email lookup
    with open(filename, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            first = row['First']
            last = row['Last']
            email = row['Email']
            phone = row['Phone']
            target = row['TargetEmail']
            p = Participant(first, last, email, phone, target)
            participants.append(p)

    people_remaining = len(participants)

def kill(first_name):
    global participants, people_remaining

    for i in range(len(participants)):
        if participants[i].get_first() == first_name:
            killed = participants[i]
            assassin_index = (i - 1) % len(participants)
            assassin = participants[assassin_index]

            new_target = killed.get_target()
            assassin.set_target(new_target)

            print(f"{killed.get_first()} {killed.get_last()} was killed by {assassin.get_first()} {assassin.get_last()}")
            print(f"{assassin.get_first()} now targets {new_target.get_first()}")

            # Remove the killed participant
            participants.pop(i)
            save_target_chain()
            return
        
    people_remaining = len(participants)
    print(f"No match found for name: {first_name}")

def show_chain():
    """Prints the current target chain."""
    print("\nCurrent target chain:")
    temp = ""
    for p in participants:
        temp += str(p.get_first()) + " -> "
    temp += participants[0].get_first()
    print(temp)
    people_remaining = len(participants)
    print(f"People remaining: {people_remaining}")

    