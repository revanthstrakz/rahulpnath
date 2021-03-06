---
author: [Rahul Nath]
title: 'Thinking Beyond Primitive Values: Value Objects'
  
tags:
  - Design
  - Programming
date: 2016-03-11 05:49:03
keywords:
description:
---

When modelling objects for our application, we use primitive values to represent their attributes or properties. By primitive values, I refer to all the primitive types (like Byte, Boolean, Int, Date) and the in-built types (String etc.) that the language supports. These are the most basic types of the programming language and are the building blocks to create custom types.

### Primitive Types and Associated Problems

When modelling classes for the domain, one of the most common things we do is to fit domain concepts into primitive types. For example

- **String** to represent Names (Employee name, Company Name, Product Name, Car Name etc.)
- **Int/Decimal/Double/Float** to represent Numbers (Age, Quantity, Money, Temperature, Distance, Upload/Download sizes etc.)

Those are just a few examples on how we 'usually' fit domain concepts into primitive types. This kind of design tends to take us more towards procedural programming, as shown below

```csharp
string phoneNumber;
... // Lot of other code

var isExtensionPhoneNumber = phoneNumber != null && phoneNumber.Length <=5;
```

The problem with this is that these constraints/logics tends to leak across the code-base and we run into problems either not handling this at certain places, handling them wrongly or any changes to these constraints ripples across the code.

### Value Object

A common factor in all the above examples is that those domain concepts follow value equality and not reference equality. Just like two strings or integers compares with each other based on their value, two names, temperature, color all compare against each other based on their value. This is where a Value Object fits in well.

> _[Value Object](http://martinfowler.com/bliki/ValueObject.html) is an object whose equality is determined by the value it holds and are immutable._

Below is a Value Object implementation of 'UserName' where we have the domain constraint that name should not be empty and at least be three characters (not a real world scenario, but just for an example). The Equals and GetHashCode methods below ensures that the equality comparison is based on the value that it holds. One could also [override the '==' and '!=' operator](<https://msdn.microsoft.com/en-au/library/ms173147(v=vs.80).aspx>) if you want to support those.

```csharp
public class UserName
{
	private string internalName;

	public UserName(string name)
	{
		if (string.IsNullOrEmpty(name))
			throw new ArgumentNullException("name");

		if (name.Length < 3)
			throw new ArgumentException("Name should be atleast 3 characters long", "name");

		internalName = name;
	}

	public override bool Equals(object obj)
	{
		var objAsName = obj as UserName;
		if ((System.Object)objAsName == null)
			return false;

		return internalName == objAsName.internalName;
	}

	public override int GetHashCode()
	{
		return internalName.GetHashCode();
	}
}
```

There is no restriction on the number of parameters that a value object should be composed of. Equality and Hashcode should use all the values that it composes of. For immutability, we have made the _internalName_ (in above case ) a private variable. You could also have it as public read-only property if you scenario demands, like in case of DateRange Value Object. Making the setters private and checking end date is not greater than the start date while construction, helps protect the [class invariants](http://people.cs.aau.dk/~normark/oop-csharp/html/notes/contracts_themes-class-inv-sect.html). In addition to that, any update to start or end date should create a new DateRange object as WithEndDate does below.

> _A class invariant is an assertion that captures the properties and relationships, which remain stable throughout the life-time of instances of the class._

```csharp
public class DateRange
{
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }

    public DateRange(DateTime startDate, DateTime endDate)
    {
        // Ignoring null checks
        if (endDate < startDate)
            throw new ArgumentException("End Date cannot be less than Start Date");

        this.StartDate = startDate;
        this.EndDate = endDate;
    }

    public DateRange WithEndDate(DateTime endDate)
    {
        return new DateRange(this.StartDate, endDate);
    }
}
... // Rest of Value Object Code to override Equals and GetHashCode
```

### Thinking as Value Objects

In the beginning, it is hard to see Value Objects in your domain, but then there is an easy trick that you can follow.

> _Any time you use a primitive type (unless within a Value Object) think more about the choice._

Once you start using more and more Value Objects you will naturally get good at it and be able to start to see more of it in your domain.

- Look for co-existing properties, that always go together (like start date and end date, first name and last Name), and try to model them as Value Objects.
- Any property that has a unit of measurement associated needs the value and the measurement unit together (Money, Temperature, Distance, Upload/Download size etc.), and is likely a Value Object.
- Properties that have structural restrictions like Phone Number, Zip Code, email etc.

Extracting these into Value Objects helps pull in a lot of '_procedural code_' into the Value Object, as shown below. Even if the extension numbers format changes, we have a single place to contain this change and can avoid a rippling change. We can also have static factory methods to assist in creating these Value Object and helps make the code readable like the _CreateFromBytes_ method below.

```csharp
PhoneNumber phoneNumber;
... // Lot of other code
if(phoneNumber.IsAnExtension())
... //Rest of code

decimal downloadBytes;
var downloadedData = UnitOfData.CreateFromBytes(downloadBytes);
... // Lot of other code
downloadedData.GetSizeInMegabytes();
... //Rest of code
```

### Implicit and Explicit Conversions

Introducing a Value Object to an existing code base might seem challenging, as it might be all over the code and a hard task to replace all at once. In cases where the Value Object replaces a single property existing in a class like a string name, phoneNumber, location etc., we can take advantage of the [implicit conversion operators](https://msdn.microsoft.com/en-us/library/z5z9kes2.aspx), to introduce new Value Objects gradually. Let's say you have a Name field that is a string and you want to move this over to a Value Object 'UserName'. We can declare an implicit operator to convert between string and UserName, which helps us gradually change over to the new ValueObject

```csharp
public static implicit operator UserName(string userName)
{
    return new UserName(userName);
}

public static implicit operator string(UserName userName)
{
    if (userName == null)
        throw new ArgumentNullException("userName");

    return userName.value;
}

public override string ToString()
{
	return internalName;
}
```

The implicit operator enables us to use UserName and string side-by-side and it will automatically convert between them without any explicit casts. This enables us to start anywhere in the application and start replacing the Primitive Value types into Value Objects without breaking the application.

```csharp
string lastName = "Nath";
UserName firstName = "Rahul";
string fullNameString = string.Format("{0} {1}", firstName , lastName);
UserName fullName = fullNameString;
```

At the application boundaries, if the data is serialized into different formats (JSON/XML) or persisted into ORM's (Entity Framework/NHibernate) you need to add [custom serialization formatters](http://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonConverter.htm) or [mapping configurations](https://msdn.microsoft.com/en-au/data/jj591617.aspx) to make sure that the Value Object gets serialized/persisted as expected.

Value Objects helps model the domain better and keeps code more readable. It also helps you change domain constraints or rules more easily and keeps them contained. Consider introducing a value object the next time you see one!
