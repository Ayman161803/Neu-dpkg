const config = require("./neutralino.config.json")
path = require("path")
const fs = require("fs")
const { exec } = require("child_process")
 path = require("path")

let generateControlFile = (arch) => {
    let packageTitle = config.cli.binaryName
    let version = config.version
    let desc = config.description

    if (!desc) {
        desc = "No description Provided"
    }



    let maintainer = config.maintainer


    if (!maintainer) {
        maintainer = "None"
    }

    let controlFile = ""

    controlFile += "Package: " + packageTitle + "\n"
    controlFile += "Version: " + version + "\n"
    controlFile += "Architecture: " + arch + "\n"
    controlFile += "Description: " + desc + "\n"
    controlFile += "Maintainer: " + maintainer + "\n"

    console.log(controlFile)
    return controlFile
}

let generateDesktopFile = (arch) => {
    let packageTitle = config.cli.binaryName
    let binaryName = config.modes.window.title + "-linux_" + "x64"
    let version = config.version
    let encoding = "UTF-8"
    let icon = path.basename(config.modes.window.icon)

    let desktopFile = "[Desktop Entry]\n"

    desktopFile += "Encoding=" + encoding + "\n"
    desktopFile += "Version=" + version + "\n"
    desktopFile += "Type=" + "Application" + "\n"
    desktopFile += "Terminal=" + false + "\n"
    desktopFile += "Exec=/usr/bin/" + binaryName + "\n"
    desktopFile += "Name=" + packageTitle + "\n"
    desktopFile += "Icon=/usr/share/applications/"+ packageTitle+"/" + icon + "\n"

    console.log(desktopFile)
    return desktopFile
}

generateControlFile('x64')

generateDesktopFile('x64')


let package = async (arch) => {

    let debianDir = config.cli.binaryName+"/DEBIAN"
    let desktopDir = config.cli.binaryName+"/usr/share/applications"
    let binDir = config.cli.binaryName+"/usr/bin"

    fs.mkdirSync(debianDir,{recursive:true})
    fs.mkdirSync(binDir,{recursive:true})
    fs.mkdirSync(desktopDir,{recursive:true})

    let controlStream = fs.createWriteStream(debianDir+"/control")

    controlStream.write(generateControlFile(arch))

    controlStream.end()


    let desktopStream = fs.createWriteStream(desktopDir+"/"+config.cli.binaryName+".desktop");

    desktopStream.write(generateDesktopFile(arch))

    desktopStream.end()


    fs.copyFileSync("dist/"+config.cli.binaryName+"/"+config.cli.binaryName+"-linux_"+arch,binDir+"/"+config.cli.binaryName+"-linux_"+arch)

    fs.copyFileSync("dist/"+config.cli.binaryName+"/resources.neu",binDir+"/resources.neu")

    fs.mkdirSync(desktopDir+"/"+config.cli.binaryName+"/",{recursive:true})

    fs.copyFileSync(config.modes.window.icon.slice(1),desktopDir+"/"+config.cli.binaryName+"/"+path.basename(config.modes.window.icon))

    exec("dpkg --build " + config.cli.binaryName + "/")
    console.log(binDir+"/"+config.cli.binaryName+"-linux_"+arch)
}
package("x64")