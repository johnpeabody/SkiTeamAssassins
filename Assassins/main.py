from game import create_game, create_target_chain, load_game, kill, show_chain, participants, show_chain, people_remaining

def game_loop():    
    while True:
        command = input("Enter command ('new', 'resume'): ").strip()
        if command.lower() == "new":
            create_game()
            create_target_chain()
            break
        elif command.lower() == "resume":
            load_game()
            break
        else:
            print("Unknown command.")
    

    while True:
        people_remaining = len(participants)
        print(people_remaining)

        if people_remaining == 1:
            print(f"{participants[0].get_first()} is the winner!")
            break

        command = input("Enter command ('kill [first name]', 'show', 'exit'): ").strip()

        if command.lower().startswith("kill "):
            first = command[5:].strip()
            kill(first)

        elif command.lower() == "show":
            show_chain()
          
        elif command.lower() == "exit":
            print("Exiting game loop.")
            break

        else:
            print("Unknown command.")

def main():
    game_loop()

if __name__ == "__main__":
    main()