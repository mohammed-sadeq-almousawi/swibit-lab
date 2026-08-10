import python_practice.welcome as welcome
import python_practice.FizzBuzz as FizzBuzz
import python_practice.Sum as Sum

while True:
    print("================================================================")
    print("\nMenu:")
    print("1. Run Welcome Script\n2. Run Sum List Script\n3. Run FizzBuzz Script\n0. Exit")
    print("================================================================")
    choice = input("Enter your choice: ")
    print("================================================================")
    print("\nyouer request is processing please wait...")
    if choice == "1":
        name = input("Enter your name:")
        welcome_1 = welcome.welcome(name)
        print(welcome_1.greeting)


    elif choice == "2":
        list_size = int(input("Enter the size of the list: "))
        numbers_list = []
        for i in range(list_size):
            number = int(input(f"Enter number {i + 1}: "))
            numbers_list.append(number)
        sum_1 = Sum.sum_list(numbers_list)
        print(f"The sum of the list is: {sum_1.total}")


    elif choice == "3":
        num = int(input("Enter a number for FizzBuzz: "))
        fizzbuzz_1 = FizzBuzz.FizzBuzz(num)
        fizzbuzz_1.run()


    elif choice == "0":
        print("Goodbye!")
        break
