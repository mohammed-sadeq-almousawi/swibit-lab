class FizzBuzz:
    def __init__(self, num):
        self.num = num

    def run(self):
        for i in range(1, self.num + 1):
            if i % 3 == 0 and i % 5 == 0:
                print(f"{i}:FizzBuzz")
            elif i % 3 == 0:
                print(f"{i}:Fizz")
            elif i % 5 == 0:
                print(f"{i}:Buzz")
            else:
                print(f"{i}:None")
