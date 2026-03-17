<%

' Permite apenas POST
If Request.ServerVariables("REQUEST_METHOD") <> "POST" Then
    Response.Write("Acesso inválido.")
    Response.End
End If

Dim name, email, subject, message
name = Request.Form("name")
email = Request.Form("email")
subject = Request.Form("subject")
message = Request.Form("message")

Dim objEmail, objConfig
Set objEmail = Server.CreateObject("CDO.Message")
Set objConfig = Server.CreateObject("CDO.Configuration")

With objConfig.Fields
    .Item("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2
    .Item("http://schemas.microsoft.com/cdo/configuration/smtpserver") = "mail.iron.hostazul.com.br"
    .Item("http://schemas.microsoft.com/cdo/configuration/smtpserverport") = 587
    .Item("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1
    .Item("http://schemas.microsoft.com/cdo/configuration/sendusername") = "contato@ceuirmaolakota.com.br"
    .Item("http://schemas.microsoft.com/cdo/configuration/sendpassword") = "@Marcelo#123"
    .Item("http://schemas.microsoft.com/cdo/configuration/smtpusessl") = False
    .Update
End With

Set objEmail.Configuration = objConfig

objEmail.From = "contato@ceuirmaolakota.com.br"
objEmail.To = "contato@ceuirmaolakota.com.br"
objEmail.Subject = subject

objEmail.TextBody = "Nome: " & name & vbCrLf & _
                    "Email: " & email & vbCrLf & vbCrLf & _
                    "Mensagem:" & vbCrLf & message

On Error Resume Next
objEmail.Send

If Err.Number <> 0 Then

Response.Write("<script>")
Response.Write("alert('Erro ao enviar email');")
Response.Write("window.location='index.html';")
Response.Write("</script>")

Else

Response.Write("<script>")
Response.Write("alert('Mensagem enviada com sucesso!');")
Response.Write("window.location='index.html';")
Response.Write("</script>")

End If

Set objEmail = Nothing
Set objConfig = Nothing

%>