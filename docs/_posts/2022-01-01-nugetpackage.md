---
date: 2022-01-02
title: NuGet Package
categories:
   - install
author_staff_member: merill
---
The Inclusiveness Analyzer can be added to any C# project. Just install using NuGet and start writing code. The extension will be automatically loaded in Visual Studio for anyone that opens your project. Using the NuGet package is best when you are working on a project with a team.

![Inclusiveness Analyzer gif](https://github.com/microsoft/InclusivenessAnalyzerVisualStudio/raw/main/docs/assets/intro.gif)

# How it works

The Inclusiveness Analyzer can be added to any C# project. Just install using NuGet and start writing code. The extension will be automatically loaded in Visual Studio for anyone that opens your project. Using the NuGet package is best when you are working on a project with a team.

* View and install [Inclusiveness Analyzer from the Nuget Gallery](https://www.nuget.org/packages/InclusivenessAnalyzer/)
* [Provide feedback and report issues](https://github.com/microsoft/InclusivenessAnalyzerVisualStudio)

## Install using the NuGet Package Manager user interface

* Open the C# project using Visual Studio
* Select **Tools** from the menu
* Select **NuGet Package Manager**
* Select **Manage NuGet Packages for Solution...**
* Select **Browse**
* Search for **inclusiveness**
* Select the checkbox next to the project(s)
* Select **Install**

![Screenshot showing nuget install from user interface.]({{ site.url }}/images/nuget-screenshot1.png)

## Install using the NuGet Package Manager console

* Open the C# project using Visual Studio
* Select **Tools** from the menu
* Select **NuGet Package Manager**
* Select **Package Manager Console**
* Run `Install-Package InclusivenessAnalyzer`

![Screenshot showing nuget install from command line.]({{ site.url }}/images/nuget-screenshot2.png)

Important Note: The Inclusiveness Analyzer is only used during development time and does not affect your projects outputs or binaries.
